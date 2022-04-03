// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";

import { StoredSubject, StoredSubjectMap } from "@api";
import { SessionItem, SessionQuestion, SessionState } from "./types";

/** Combines a question, item and subject all into one object. */
export interface MappedQuestion {
  questionId: number;
  question: SessionQuestion;
  item: SessionItem;
  subject: StoredSubject;
}

/** Combines an array of questions, items and subjects all into one object. */
export const mapQuestions = (
  subjects: StoredSubjectMap,
  questions: SessionQuestion[],
  items: SessionItem[]
): MappedQuestion[] => questions.map((q, i) => ({
  questionId: i,
  question: q,
  item: items[q.itemId],
  subject: subjects[items[q.itemId].subjectId]
}));

/** Returns whether this question is a meaning question. */
export const isMeaning = (q: MappedQuestion): boolean => q.question.type === "meaning";
/** Returns whether this question is a reading question. */
export const isReading = (q: MappedQuestion): boolean => q.question.type === "reading";

/** Returns whether or not an item has been started. An item is started if it
 * has at least one answer, but hasn't been completed. */
export const isItemStarted = (i: SessionItem): boolean =>
  i.numAnswers > 0 && !isItemFinished(i);
/** Returns whether or not a question's item has been started. An item is
 * started if it has at least one answer, but hasn't been completed. */
export const isStarted = (q: MappedQuestion): boolean => isItemStarted(q.item);
/** Returns the total number of started items in the session. */
export const getNumStartedItems = (items: SessionItem[]): number =>
  items.reduce((sum, item) => sum + (isItemStarted(item) ? 1 : 0), 0);
/** Returns the total number of started items in the session. */
export const getNumStarted = (qs: MappedQuestion[]): number =>
  qs.reduce((sum, q) => sum + (isStarted(q) ? 1 : 0), 0);

/** Returns whether or not an item has been finished. An item is finished if all
 * its questions have been completed. */
export const isItemFinished = (i: SessionItem): boolean =>
  i.meaningCompleted && i.readingCompleted;
/** Returns whether or not a question's item has been finished. An item is
 * finished if all its questions have been completed. */
export const isFinished = (q: MappedQuestion): boolean => isItemFinished(q.item);
/** Returns the total number of finished items in the session. */
export const getNumFinishedItems = (items: SessionItem[]): number =>
  items.reduce((sum, item) => sum + (isItemFinished(item) ? 1 : 0), 0);

/** Returns the total number of skipped items in the session. This is the number
 * of un-started items (no answers yet) that have a choice delay (from a DELAY
 * skip) or have putEnd set (from a PUT_END skip). */
export const getNumSkippedItems = (items: SessionItem[]): number =>
  items.reduce((sum, item) => sum +
    (item.numAnswers === 0 && (item.choiceDelay > 0 || item.putEnd)
      ? 1 : 0), 0);

/** Returns the total number of non-abandoned items in the session. When not
 * wrapping up, this is simply the number of items. However, when wrapping up,
 * it excludes items that were never stated. */
export const getNumTotalItems = (items: SessionItem[]): number =>
  items.reduce((sum, item) => sum + (item.abandoned ? 0 : 1), 0);

/** Returns whether or not an item has been finished and has no incorrect
 * answers. */
export const isItemCorrect = (i: SessionItem): boolean =>
  i.meaningCompleted && i.readingCompleted
  && i.meaningIncorrectAnswers <= 0 && i.readingIncorrectAnswers <= 0;
/** Returns whether or not an item has been finished and has at least one
 * incorrect answer. */
export const isItemIncorrect = (i: SessionItem): boolean =>
  i.meaningCompleted && i.readingCompleted
  && (i.meaningIncorrectAnswers > 0 || i.readingIncorrectAnswers > 0);

/** Returns whether or not the SessionItem has a meaning and reading question
 * still to be answered. */
export const hasPendingMeaningAndReading = (q: MappedQuestion): boolean =>
  !q.item.meaningCompleted && !q.item.readingCompleted;

export interface SessionItemsCount {
  startedItems: number;
  finishedItems: number;
  skippedItems: number;
  totalItems: number;
  wrappingUp: boolean;
}

/**
 * Gets the number of finished items and total number of items in the session,
 * and whether or not the session is 'wrapping up' (i.e. the number of started
 * items is equal to the total number of items).
 */
export function countSessionItems(
  sessionState: SessionState = store.getState().session.sessionState!
): SessionItemsCount {
  if (!sessionState) throw new Error("No session available!");

  const { items } = sessionState;

  const totalItems = getNumTotalItems(items);
  const startedItems = getNumStartedItems(items);
  const finishedItems = getNumFinishedItems(items);
  const skippedItems = getNumSkippedItems(items);

  const wrappingUp = startedItems >= totalItems;

  return { startedItems, finishedItems, skippedItems, totalItems, wrappingUp };
}
