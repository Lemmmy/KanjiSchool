// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import * as syncActions from "@store/syncSlice.ts";
import { submitAssignment } from "@store/sessionSlice.ts";

import * as api from "@api";
import { ApiUser } from "@api";
import { db } from "@db";

import dayjs from "dayjs";
import { getOnlineStatus, sleep } from "@utils";

import { globalNotification } from "@global/AntInterface.tsx";

import Debug from "debug";
const debug = Debug("kanjischool:api-submission-queue");

export interface StoredQueueItem {
  type: "lesson" | "review";

  id: number;
  assignmentId: number;
  sessionUuid: string;
  sessionItemId: number;

  // When the lesson/review was first queued. When sent to the server, if this
  // date is less than 5 minutes ago, then the current time will be used
  // instead.
  createdAt: Date;

  // For reviews only:
  meaningIncorrectAnswers?: number;
  readingIncorrectAnswers?: number;
  potentialLevelUp?: boolean;

  // The number of times this item has failed to submit. After 3, it will be
  // removed from the queue and the user will have to re-submit it.
  failedAttempts: number;
}

export type QueueReview = StoredQueueItem & { type: "review" };
export type QueueLesson = StoredQueueItem & { type: "lesson" };

export async function insertQueueItem(
  type: "lesson" | "review",
  assignmentId: number,
  sessionUuid: string,
  sessionItemId: number,
  createdAt: Date,
  meaningIncorrectAnswers?: number,
  readingIncorrectAnswers?: number,
  potentialLevelUp?: boolean
): Promise<StoredQueueItem> {
  const newItem: Omit<StoredQueueItem, "id"> = {
    type, assignmentId, sessionUuid, sessionItemId, createdAt,
    meaningIncorrectAnswers, readingIncorrectAnswers, potentialLevelUp,
    failedAttempts: 0
  };

  const newId = await db.queue.add(newItem as StoredQueueItem);
  store.dispatch(syncActions.incrQueueNonce());

  // Request to start processing the queue if it isn't already processing
  processQueue();

  return { id: newId, ...newItem };
}

export async function processQueue(): Promise<void> {
  // Don't do anything if the user is currently offline. The items will stay in
  // the queue and get submitted when network connectivity is restored.
  if (!getOnlineStatus()) {
    debug("not processing queue - no connection");
    return;
  }

  if (store.getState().sync.processingQueue) return;
  debug("starting queue processing");
  store.dispatch(syncActions.setProcessingQueue(true));
  store.dispatch(syncActions.setQueueConnectionError(false));

  // See if we can connect to the server first. If not, don't start processing
  // any queue items until we can. In the event that the server disappears for
  // a few minutes (there's currently a potential bug where this happens during
  // level-up), no submissions will be lost.
  let connected = false;
  do {
    try {
      const user = await api.get<ApiUser>("/user");
      if (!user || !user.data.id) throw new Error("No user");
      connected = true;
      store.dispatch(syncActions.setQueueConnectionError(false));
    } catch (err) {
      // If the user is now offline, stop processing the queue completely. The
      // items will stay in the queue and get submitted when network
      // connectivity is restored.
      if (!getOnlineStatus()) {
        debug("abandoning submission queue during connection loop, user is now offline.");
        return;
      }

      // Otherwise, it's likely that the error was a server error. Retry in 5
      // seconds.
      debug("could not connect to server, not processing queue yet. waiting 5 seconds");
      store.dispatch(syncActions.setQueueConnectionError(true));
      await sleep(5000);
      console.error(err);
    }
  } while (!connected);

  // Track whether a potential level-up review was submitted. If so, the
  // user may also be re-fetched.
  let hasLevelUp = false;

  // Keep fetching jobs from the db until there are none left
  let count = 0, total = 0, queueLength = 0;
  do {
    // Fetch the incomplete jobs from the db
    const queueItems = await db.queue.toArray();
    queueLength = queueItems.length;
    total += queueLength;

    if (queueLength === 0) break;

    for (const item of queueItems) {
      debug("processing queue item %d: %o", item.id, item);

      // If the assignment was created more than 5 minutes ago, submit the
      // date/time it was created. Otherwise, submit the current time.
      const now = dayjs();
      const createdAt = item.createdAt;
      const submitDate = now.subtract(5, "minute").isBefore(createdAt)
        ? createdAt : now.toDate();
      if (submitDate !== createdAt)
        debug("submit time difference: %o / %o", submitDate, createdAt);

      let shouldRemove = false;
      if (item.type === "lesson") {
        shouldRemove = await submitQueueLesson(item as QueueLesson, submitDate);
      } else if (item.type === "review") {
        const review = item as QueueReview;
        shouldRemove = await submitQueueReview(review, submitDate);

        // Queue a user re-fetch on session completion
        if (shouldRemove && review.potentialLevelUp) {
          hasLevelUp = true;
        }
      }

      // Remove the queue item from the database and dispatch the submission
      if (shouldRemove) {
        try {
          await db.queue.delete(item.id);
          store.dispatch(syncActions.incrQueueNonce());
        } catch (err) {
          debug("couldn't remove queue item (probably already removed?)");
          console.error(err);
        }

        dispatchAssignmentSubmission(item);
      }

      count++;
      store.dispatch(syncActions.setQueueProgress({ count, total }));
    }
  } while (queueLength > 0);

  store.dispatch(syncActions.setQueueProgress({ count: -1, total: -1 }));

  // If we submitted a potential level-up item (SRS 4->5 kanji on current user
  // level), then re-fetch the user before loading everything else.
  if (hasLevelUp) {
    debug("submission queue has potential level ups, fetching user");
    await api.syncUser();
  }

  // Now assignments can be synced, to get the real values rather than our
  // temporary fake ones. If we are still in a session, don't sync the
  // assignments yet, as the session will handle that by itself.
  const nowSession = store.getState().session.sessionState;
  if (!nowSession) {
    debug("now syncing assignments, reviews, and review statistics");
    try {
      await Promise.all([
        api.syncAssignments(), // Will also reload the review forecast itself
        api.syncReviews(),
        api.syncReviewStatistics()
      ]);
    } catch (err) {
      debug("couldn't sync assignments during queue submission!!");
      globalNotification.error({
        message: "Syncing assignments failed.",
        description: "Please try to manually refresh them, or reload the app."
      });
      console.error(err);
    }
  }

  debug("done queue processing");
  store.dispatch(syncActions.setProcessingQueue(false));
}

async function submitQueueLesson(
  item: QueueLesson,
  submitDate: Date
): Promise<boolean> {
  debug("attempting to submitting queue lesson %d", item.id);
  try {
    await api.startAssignment(item.assignmentId, submitDate);
    debug("submitted successfully");
    return true;
  } catch (err) {
    console.error(err);
    return await markQueueItemFailed(item);
  }
}

async function submitQueueReview(
  item: QueueReview,
  submitDate: Date
): Promise<boolean> {
  debug("attempting to submitting queue review %d", item.id);
  try {
    await api.createReview(
      item.assignmentId,
      item.meaningIncorrectAnswers ?? 0,
      item.readingIncorrectAnswers ?? 0,
      submitDate
    );
    debug("submitted successfully");
    return true;
  } catch (err) {
    console.error(err);
    return await markQueueItemFailed(item);
  }
}

// Dispatch an assignment submission if the session is still ongoing.
function dispatchAssignmentSubmission(item: StoredQueueItem) {
  const nowSession = store.getState().session.sessionState;
  if (nowSession?.uuid === item.sessionUuid) {
    store.dispatch(submitAssignment(item.sessionItemId));
  } else {
    debug("didn't mark assignment %d as submitted because the session changed", item.assignmentId);
  }
}

// If a queue item failed to submit, increment its 'failedAttempts' counter. If
// it failed more than 3 times, remove it from the database and return true.
async function markQueueItemFailed(item: StoredQueueItem): Promise<boolean> {
  const attempts = ++item.failedAttempts;
  if (attempts >= 3) {
    // Failed too many times, remove it from the database
    debug("queue item failed too many times, removing from queue");
    globalNotification.error({
      message: "Assignment submission failed!",
      description: "Failed after 3 attempts. See console for details."
    });
    await db.queue.delete(item.id);
    store.dispatch(syncActions.incrQueueNonce());
    return true;
  } else {
    // Increment the counter and store it in the database
    debug("queue item failed, trying again (attempt %d)", attempts);
    await db.queue.put({ ...item, failedAttempts: attempts });
    store.dispatch(syncActions.incrQueueNonce());
    return false;
  }
}
