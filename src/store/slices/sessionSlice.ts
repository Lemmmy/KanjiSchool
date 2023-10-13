// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  isItemCorrect, isItemFinished,
  isItemIncorrect, isItemStarted,
  loadSession,
  SessionItem, SessionQuestion,
  SessionResults,
  SessionState,
  SessionType
} from "@session";
import { SessionOpts } from "@session/order/options.ts";

import { max } from "d3-array";
import { DigraphMatch, lsGetBoolean, lsGetNumber, lsGetObject, unlut } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:session-slice");

export interface SessionSliceState {
  ongoing: boolean;
  sessionState?: SessionState;
  doingLessons: boolean;
  lessonCounter: number;
  currentQuestion: number | null;
  incorrectAnswer?: string;
  incorrectAnswerDigraphMatch?: DigraphMatch;

  lastResults?: SessionResults;
  lastResultsViewed: boolean;

  studyQueue?: Record<number, 1>;
  studyQueueCollapsed: boolean;
}

export const initialState = (): SessionSliceState => ({
  ongoing: lsGetBoolean("sessionOngoing2"),
  sessionState: loadSession(),
  doingLessons: lsGetBoolean("sessionDoingLessons"),
  lessonCounter: lsGetNumber("sessionLessonCounter", 0) ?? 0,
  currentQuestion: null,
  incorrectAnswer: undefined,

  lastResults: lsGetObject<SessionResults>("sessionLastResults"),
  lastResultsViewed: lsGetBoolean("sessionLastResultsViewed", true),

  studyQueue: unlut(lsGetObject<number[]>("selfStudyQueue")),
  studyQueueCollapsed: false
});

interface StartSessionPayload {
  type: SessionType;
  uuid: string;
  items: SessionItem[];
  questions: SessionQuestion[];
  comparatorOptions: SessionOpts;
  withLessons?: boolean;
}

interface IncorrectAnswerPayload {
  answer: string;
  digraphMatch?: DigraphMatch;
}

interface AnswerQuestionPayload {
  type: "meaning" | "reading";
  itemId: number;
  correct: boolean;
}

export type SkipQuestionPayload = Omit<AnswerQuestionPayload, "correct">;

function endSessionState(s: SessionSliceState) {
  const sess = s.sessionState;
  const lastResults: SessionResults | undefined = sess ? {
    type: sess.type,
    uuid: sess.uuid,
    completedAt: new Date().toISOString(),

    correctSubjectIds: sess.items.filter(isItemCorrect).map(s => s.subjectId),
    incorrectSubjectIds: sess.items.filter(isItemIncorrect).map(s => s.subjectId),
  } : undefined;

  debug("endSessionState lastResults: %o", lastResults);

  s.ongoing = false;
  s.sessionState = undefined;
  s.doingLessons = false;
  s.lessonCounter = 0;
  s.currentQuestion = null;
  s.incorrectAnswer = undefined;

  s.lastResults = lastResults;
  s.lastResultsViewed = !lastResults;
}

const delaySkipHandler = (putEnd: boolean) => (s: SessionSliceState, { payload }: PayloadAction<SkipQuestionPayload>) => {
  if (!s.sessionState) return s;

  // Clone the item so we can mutate it
  const { itemId } = payload;
  const items = s.sessionState.items;
  const item = items[itemId];

  if (putEnd) {
    // If this is PUT_END rather than DELAY, place the item in the max bucket
    // (items.length + 1) and mark it as 'putEnd' which will always sort it last
    // in chooseQuestion
    const maxBucket = Math.max(
      items.length + 1,
      max(items, i => i.bucket) ?? 1
    );
    debug("pushing item %d to max bucket %d", itemId, maxBucket);
    item.bucket = maxBucket;
    item.putEnd = true;
  }

  // Set the choice delay of the question to 3, so it appears later
  item.choiceDelay = 3;

  // Remove the currentQuestion so it can be re-assigned by chooseQuestion
  s.currentQuestion = null;

  // Reset the incorrectAnswer too
  s.incorrectAnswer = undefined;
  s.incorrectAnswerDigraphMatch = undefined;
};

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    startSession(s, { payload }: PayloadAction<StartSessionPayload>) {
      s.ongoing = true;
      s.sessionState = payload;
      s.doingLessons = (payload.withLessons ?? false) || payload.type === "lesson";
      s.lessonCounter = 0;
      s.currentQuestion = null;
      s.incorrectAnswer = undefined;
      s.incorrectAnswerDigraphMatch = undefined;

      s.lastResults = undefined;
      s.lastResultsViewed = true;
    },

    prevLesson(s) {
      s.lessonCounter = Math.max(0, s.lessonCounter - 1);
    },

    nextLesson(s) {
      const lessonCount = s.sessionState?.items.length || 0;
      const newCounter = s.lessonCounter + 1;
      const finished = newCounter >= lessonCount;

      s.lessonCounter = finished ? 0 : newCounter;
      s.doingLessons = !finished;
    },

    setQuestion(s, { payload }: PayloadAction<number>) {
      s.currentQuestion = payload;
    },

    setIncorrectAnswer(s, { payload }: PayloadAction<IncorrectAnswerPayload | undefined>) {
      const { answer, digraphMatch } = payload || {};
      s.incorrectAnswer = answer;
      s.incorrectAnswerDigraphMatch = digraphMatch;
    },

    // Decrement choice delay for session items
    decrChoiceDelay(s) {
      if (!s.sessionState) return;

      for (const item of s.sessionState.items) {
        if (item.choiceDelay > 0) {
          const newDelay = item.choiceDelay - 1;
          debug("reducer decrementing choice delay for %d (%d -> %d)", item.subjectId, item.choiceDelay, newDelay);
          item.choiceDelay = newDelay;
        }
      }
    },

    answerQuestion(s, { payload }: PayloadAction<AnswerQuestionPayload>) {
      if (!s.sessionState) return;

      const { type, itemId, correct } = payload;
      const { items, questions } = s.sessionState;

      const item = items[itemId];

      // Incorrect the answer counter (regardless of whether it was correct)
      item.numAnswers++;

      if (correct) {
        // Mark the question as correct
        if (type === "meaning") item.meaningCompleted = true;
        else if (type === "reading") item.readingCompleted = true;

        // Find the ID of the relevant question
        const questionId = questions.findIndex(q => q.itemId === itemId && q.type === type);
        if (questionId < 0) {
          debug("answerQuestion can't find question: itemId %d  type %s  questions %o", itemId, type, questions);
          throw new Error("Attempted to answer question that isn't in the questions pool");
        }

        // Remove the question from the questions list
        questions.splice(questionId, 1);
      } else {
        // Increment the incorrect answer counter if the answer was incorrect
        if (type === "meaning") item.meaningIncorrectAnswers++;
        else if (type === "reading") item.readingIncorrectAnswers++;

        // Set the choice delay of the question to 3, so it appears later
        item.choiceDelay = 3;
      }

      // Remove the currentQuestion, so it can be re-assigned by chooseQuestion afterwards if necessary
      s.currentQuestion = null;

      // Reset the incorrectAnswer too
      s.incorrectAnswer = undefined;
      s.incorrectAnswerDigraphMatch = undefined;
    },

    // Skip the current question, specific behavior depends on the desired skip
    // setting.
    //   - DELAY - Put the question back into the same bucket with a choice delay
    //       of 3. In most cases it will appear later, but it may still appear
    //       immediately.
    //   - PUT_END - Put the question back into the highest bucket so that it
    //       appears at the end of the session, with a choice delay of 3.
    //   - REMOVE - Remove the item (both questions) from the session entirely.
    skipQuestionDelay: delaySkipHandler(false),
    skipQuestionPutEnd: delaySkipHandler(true),
    skipQuestionRemove(s, { payload }: PayloadAction<SkipQuestionPayload>) {
      if (!s.sessionState) return;

      const { itemId } = payload;
      const items = s.sessionState.items;
      const item = items[itemId];

      // Mark the item as abandoned
      item.abandoned = true;

      // Remove the item from the questions
      const questions = s.sessionState.questions;
      const questionId = questions.findIndex(q => q.itemId === itemId && q.type === payload.type);
      if (questionId >= 0) questions.splice(questionId, 1);

      // Remove the currentQuestion, so it can be re-assigned by chooseQuestion
      s.currentQuestion = null;

      // Reset the incorrectAnswer too
      s.incorrectAnswer = undefined;
      s.incorrectAnswerDigraphMatch = undefined;
    },

    // Mark assignment as submitted
    submitAssignment(s, { payload }: PayloadAction<number>) {
      if (!s.sessionState) return;
      s.sessionState.items[payload].submitted = true;
    },

    // Wrap up the session by removing all un-started items
    wrapUpSession(s) {
      if (!s.sessionState) return;

      const { items, questions } = s.sessionState;

      for (const item of items) {
        // If the item isn't started or finished yet, mark it as abandoned
        if (!isItemStarted(item) && !isItemFinished(item)) {
          item.abandoned = true;
        }
      }

      // Remove all questions that haven't been started yet
      const startedQuestions = questions
        .filter(q => isItemStarted(items[q.itemId]));

      if (startedQuestions.length > 0) {
        // If there are still questions left, unset the current one, so that the session page will select a new one
        s.sessionState.questions = startedQuestions;
        s.currentQuestion = null;
        s.incorrectAnswer = undefined;
        s.incorrectAnswerDigraphMatch = undefined;
      } else {
        // Otherwise, if the questions pool is now empty, end the session
        endSessionState(s);
      }
    },

    // Starts the session review immediately, with only the lessons that were covered
    startLessonReviewNow(s) {
      if (!s.sessionState) return;

      const { items, questions } = s.sessionState;

      // Remove all items that are beyond the current lesson counter
      const lessonItems = items.filter(i => i.bucket <= s.lessonCounter);
      const lessonQuestions = questions.filter(q => lessonItems[q.itemId]);

      debug("startLessonReviewNow: lessonItems %o  lessonQuestions %o", lessonItems, lessonQuestions);

      s.sessionState.items = lessonItems;
      s.sessionState.questions = lessonQuestions;

      s.lessonCounter = 0;
      s.doingLessons = false;
    },

    // End the session
    endSession: endSessionState,

    setResultsViewed(s, { payload }: PayloadAction<boolean>) {
      s.lastResultsViewed = payload;
    },

    studyQueueSetCollapsed(s, { payload }: PayloadAction<boolean>) {
      s.studyQueueCollapsed = payload;
    },

    studyQueueAdd(s, { payload }: PayloadAction<number[]>) {
      if (!s.studyQueue) s.studyQueue = {};

      for (const id of payload) {
        s.studyQueue[id] = 1;
      }

      s.studyQueueCollapsed = false;
    },

    studyQueueRemove(s, { payload }: PayloadAction<number>) {
      if (!s.studyQueue) return;
      delete s.studyQueue[payload];
    },

    studyQueueClear(s) {
      s.studyQueue = undefined;
      s.studyQueueCollapsed = false;
    }
  }
});

export const {
  startSession,
  prevLesson,
  nextLesson,
  setQuestion,
  setIncorrectAnswer,
  decrChoiceDelay,
  answerQuestion,
  skipQuestionDelay,
  skipQuestionPutEnd,
  skipQuestionRemove,
  submitAssignment,
  wrapUpSession,
  startLessonReviewNow,
  endSession,
  setResultsViewed,
  studyQueueSetCollapsed,
  studyQueueAdd,
  studyQueueRemove,
  studyQueueClear
} = sessionSlice.actions;

export default sessionSlice.reducer;
