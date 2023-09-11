// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { answerQuestion, endSession } from "@store/slices/sessionSlice.ts";

import * as api from "@api";

import { SessionItem, saveSession, sessionHasAssignment } from "../";
import { submitAssignmentLesson } from "./lesson";
import { submitAssignmentReview } from "./review";

import Debug from "debug";
const debug = Debug("kanjischool:session-submission");

export function submitQuestionAnswer(
  type: "meaning" | "reading",
  itemId: number,
  { assignmentId }: SessionItem,
  correct: boolean
): boolean {
  debug("submitting question answer for %d (correct: %o)", assignmentId, correct);

  const { user } = store.getState().auth;
  const userLevel = user?.data.level ?? 1;
  const maxLevel = user?.data.subscription.max_level_granted ?? 3;

  const { subjects } = store.getState().subjects;
  const { assignments } = store.getState().assignments;
  const { reviewStatistics, subjectReviewStatisticIdMap } = store.getState().reviewStatistics;
  if (!subjects || !assignments || !reviewStatistics) {
    throw new Error("No assignments or other data available yet!");
  }

  const assignment = assignments[assignmentId || -1];
  const subject = subjects[assignment?.data.subject_id || -1];
  if (subject?.data.level > maxLevel) {
    throw new Error("Question cannot be submitted at WaniKani current subscription level.");
  }

  // First, update the question in the Redux store, so the user can move on
  // immediately.
  debug("dispatching session state");
  store.dispatch(answerQuestion({ type, itemId, correct }));

  // If both the meaning and reading are now completed (or just the meaning for
  // radicals), and this is not a self-study, submit the review to the server,
  // asynchronously.
  const sessionState = store.getState().session.sessionState;
  if (!sessionState) throw new Error("no session state");
  const newItem = sessionState.items[itemId];

  // Note that readingCompleted is always `true` for radical readings
  const assignmentCompleted = newItem.meaningCompleted && newItem.readingCompleted;

  // Figure out if the session is now complete (questions list is empty)
  const sessionComplete = sessionState.questions.length === 0;

  function syncIfNeeded() {
    if (!sessionComplete) return;
    debug("session complete, reloading assignment forecast");
    api.reloadAssignments();
  }

  if (assignmentCompleted) {
    if (sessionState.type !== "self_study" && sessionHasAssignment(newItem)) {
      debug("assignment %d now completed, submitting to server", assignmentId);

      switch (sessionState.type) {
      case "lesson":
        submitAssignmentLesson(itemId, assignment, sessionState)
          .then(syncIfNeeded);
        break;
      case "review":
        submitAssignmentReview(
          itemId,
          userLevel,
          subject!,
          assignment!,
          assignment.data.srs_stage,
          reviewStatistics[subjectReviewStatisticIdMap[assignment.data.subject_id] ?? -1],
          newItem,
          sessionState
        )
          .then(syncIfNeeded);
        break;
      }
    } else {
      debug("question is either self study or does not have an assignment, not submitting to server");
    }
  }

  // Session is complete, clear it from the Redux store
  if (sessionComplete) {
    debug("session complete, clearing from redux");
    store.dispatch(endSession());
  }

  debug("saving session");
  saveSession();

  return sessionComplete;
}
