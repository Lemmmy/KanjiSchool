// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";
import * as actions from "@actions/SessionActions";

import {
  MappedQuestion, mapQuestions,
  isStarted, hasPendingMeaningAndReading,
  isReading, isMeaning, getNumStarted
} from "./utils";

import Debug from "debug";
const debug = localStorage.getItem("kanjischool-chooseQuestionDebug") === "true"
  ? Debug("kanjischool:session-choose-question")
  : (): void => { /* noop */ };

export function chooseQuestion(): void {
  const { subjects } = store.getState().sync;
  if (!subjects) throw new Error("No subjects available yet!");
  const { sessionState } = store.getState().session;
  if (!sessionState) return;

  const { items, questions, comparatorOptions: opts } = sessionState;

  // All unfinished questions from the session. Questions get removed from this
  // list when they are completed (all parts correct). From here on, all parts
  // will operate on this candidateQuestions list, modifying it in order, unless
  // otherwise noted. Whenever the candidateQuestions list is replaced, it is
  // ONLY replaced if the new list is not empty.
  let candidateQuestions: MappedQuestion[] =
    mapQuestions(subjects, questions, items);
  debug("candidate questions: %o", candidateQuestions);

  // If there are items both with and without putEnd, then remove all putEnd
  // questions. This means putEnd skipped questions will be handled last.
  const notPutEnds = candidateQuestions.filter(q => !q.item.putEnd);
  if (notPutEnds.length !== candidateQuestions.length && notPutEnds.length > 0) {
    debug("notPutEnds replaced list with %o", notPutEnds);
    candidateQuestions = notPutEnds;
  }

  // For any meaning/reading back-to-back setting enabled; if there are any
  // questions that have been started (should only be 1 unless any are
  // incorrect), make it the candidate questions list.
  if (opts.meaningReadingBackToBack) {
    const list = candidateQuestions.filter(isStarted);
    if (list.length > 0) {
      debug("meaningReadingBackToBack replaced list with %o", list);
      candidateQuestions = list;
    }
  }

  // If we always want the reading first, handle that. For a more detailed
  // description of the implementation, see the FD repo, but this filters the
  // candidateQuestions list to:
  //    `!hasPendingMeaningAndReading || isReading`
  // -> `hasAtLeastOneCompletedAnswer || isReading`
  // -> `(readingComplete || meaningComplete) || isReading`
  //      ^ (not both of course, since it'd be removed from the question pool)
  // So, the candidateQuestions list is now a list containing:
  //  - all reading questions
  //  - questions that have had either a meaning or reading completed
  // Which, as a result, forces the reading questions to come first.
  if (opts.readingFirst) {
    const list = candidateQuestions.filter(q =>
      !hasPendingMeaningAndReading(q) || isReading(q));
    if (list.length > 0) {
      debug("readingFirst replaced list with %o", list);
      candidateQuestions = list;
    }
  }

  // Same as readingFirst, but if we want the meaning first.
  // candidateQuestions is now a list containing:
  //   - all meaning questions
  //   - questions that have had either a meaning or a reading completed
  // Which, as a result, forces the meaning questions to come first.
  if (opts.meaningFirst) {
    const list = candidateQuestions.filter(q =>
      !hasPendingMeaningAndReading(q) || isMeaning(q));
    if (list.length > 0) {
      debug("meaningFirst replaced list with %o", list);
      candidateQuestions = list;
    }
  }

  // Keep the 'started' questions pool smaller than 10 items. For a more
  // detailed description of how this works, see the FD repo. If there are more
  // than 10 started items, replace the candidateQuestions list with ONLY those
  // started items, which forces at least one of them to be completed
  // immediately. This prevents you from having too many half-completed
  // questions to remember in pairs at once, and makes wrapping up the session
  // much quicker and easier.
  const maxStarted = opts.maxStarted || 10;
  if (getNumStarted(candidateQuestions) >= maxStarted) {
    const list = candidateQuestions.filter(isStarted);
    if (list.length > 0) {
      debug("getNumStartedItems 2 replaced list with %o", list);
      candidateQuestions = list;
    }
  }

  // Figure out if there are any delayed items within the current bucket, see
  // the FD repo for a more in-depth explanation of what this does.
  // NOTE: I still don't really know *why* this is done.
  let hasDelayed = false, hasUndelayed = false;
  const currentBucket = candidateQuestions[0].item.bucket;
  for (const { item } of candidateQuestions) {
    if (item.bucket === currentBucket) {
      if (item.choiceDelay === 0) hasUndelayed = true;
      else hasDelayed = true;
    }
  }
  debug("2 bucket: %d  hasDelayed: %o  hasUndelayed: %o", currentBucket, hasDelayed, hasUndelayed);

  // If we have both delayed and non-delayed items (in this current bucket),
  // then replace the candidate list with questions from the current bucket,
  // that are not delayed. This forces delayed items to not appear yet, and
  // causes us to stick with the current ordering bucket.
  if (hasDelayed && hasUndelayed) {
    const list = candidateQuestions
      .filter(q => q.item.bucket === currentBucket)
      .filter(q => q.item.choiceDelay === 0);
    if (list.length > 0) {
      debug("hasDelayed/hasUndelayed replaced list with %o", list);
      candidateQuestions = list;
    }
  }

  // Once again get the current bucket (not sure why)
  const bucket = candidateQuestions[0].item.bucket;
  // Count the number of candidate questions that are in this current bucket.
  let i = 1;
  while (i < candidateQuestions.length && candidateQuestions[i].item.bucket === bucket) {
    i++;
  }
  // Pick a random question index FROM THIS BUCKET.
  const index = Math.floor(Math.random() * i);
  const pickedQuestion = candidateQuestions[index];
  debug("bucket: %d  picked question %d/%d (question %d)", bucket, index, i, pickedQuestion.questionId);

  store.dispatch(actions.setQuestion(pickedQuestion.questionId));
  store.dispatch(actions.decrChoiceDelay());
}
