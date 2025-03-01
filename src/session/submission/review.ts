// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiReviewStatistic, insertQueueItem, StoredAssignment, StoredSubject } from "@api";
import { SessionItemWithAssignment, SessionState, showSrsNotification } from "../";
import { fakeSubmission } from "./fakeSubmission";

import { getNewSrsStage } from "@utils";

import { globalNotification } from "@global/AntInterface.tsx";

import Debug from "debug";
const debug = Debug("kanjischool:session-submission");

export async function submitAssignmentReview(
  itemId: number,
  userLevel: number,
  subject: StoredSubject,
  assignment: StoredAssignment,
  oldSrsStage: number,
  reviewStatistic: ApiReviewStatistic | undefined,
  { meaningIncorrectAnswers, readingIncorrectAnswers }: SessionItemWithAssignment,
  sessionState: SessionState
): Promise<void> {
  try {
    const createdAt = new Date();

    // Calculate the new SRS stage for the notification and for temporary fake
    // assignment storage.
    const incorrectAnswers = meaningIncorrectAnswers + readingIncorrectAnswers;
    const newSrsStage = getNewSrsStage(oldSrsStage, incorrectAnswers);

    // Mark the queue item as a potential level-up item if it is a current-level
    // kanji going from SRS stage 4 to 5. This may trigger a user re-fetch.
    const potentialLevelUp = subject.object === "kanji"
      && subject.data.level === userLevel
      && oldSrsStage === 4 && newSrsStage === 5;

    // Show the SRS stage change notification
    debug("srs stage %d -> %d. potential level-up? %o", oldSrsStage, newSrsStage, potentialLevelUp);
    showSrsNotification(oldSrsStage, newSrsStage);

    // Preemptively mark the assignment as completed in the assignment store in
    // Redux and the database (at least until it fails to submit for 3 times).
    await fakeSubmission(
      assignment, oldSrsStage, newSrsStage, createdAt,
      reviewStatistic, meaningIncorrectAnswers, readingIncorrectAnswers
    );

    // Queue the assignment for submission.
    await insertQueueItem(
      "review", assignment.id, sessionState.uuid, itemId, createdAt,
      meaningIncorrectAnswers, readingIncorrectAnswers, potentialLevelUp
    );
    debug("assignment %d added to queue", assignment.id);
  } catch (err) {
    console.error(err);
    globalNotification.error({ message: "Submitting assignment failed. See console for details." });
  }
}
