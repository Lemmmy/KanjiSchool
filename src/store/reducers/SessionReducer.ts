// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import * as actions from "@actions/SessionActions";
import { SkipQuestionPayload } from "@actions/SessionActions";
import { createReducer } from "typesafe-actions";

import {
  SessionState, SessionResults, loadSession,
  isItemStarted, isItemCorrect, isItemIncorrect, SessionItem, isItemFinished
} from "@session";

import { DigraphMatch, lsGetBoolean, lsGetNumber, lsGetObject, unlut } from "@utils";
import { max } from "d3-array";

import Debug from "debug";
const debug = Debug("kanjischool:session-reducer");

export interface State {
  readonly ongoing: boolean;
  readonly sessionState?: SessionState;
  readonly doingLessons: boolean;
  readonly lessonCounter: number;
  readonly currentQuestion: number | null;
  readonly incorrectAnswer?: string;
  readonly incorrectAnswerDigraphMatch?: DigraphMatch;

  readonly lastResults?: SessionResults;
  readonly lastResultsViewed: boolean;

  readonly studyQueue?: Record<number, 1>;
  readonly studyQueueCollapsed: boolean;
}

export function getInitialSessionState(): State {
  return {
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
  };
}

function endSessionState(state: State): State {
  const s = state.sessionState;
  const lastResults: SessionResults | undefined = s ? {
    type: s.type,
    uuid: s.uuid,
    completedAt: new Date().toISOString(),

    correctSubjectIds: s.items.filter(isItemCorrect).map(s => s.subjectId),
    incorrectSubjectIds: s.items.filter(isItemIncorrect).map(s => s.subjectId),
  } : undefined;

  debug("endSessionState lastResults: %o", lastResults);

  return {
    ...state,

    ongoing: false,
    sessionState: undefined,
    doingLessons: false,
    lessonCounter: 0,
    currentQuestion: null,
    incorrectAnswer: undefined,

    lastResults,
    lastResultsViewed: lastResults ? false : true
  };
}

const delaySkipHandler = (putEnd: boolean) => (
  state: State,
  { payload }: { payload: SkipQuestionPayload }
): State => {
  if (!state.sessionState) return state;

  // Clone the item so we can mutate it
  const { itemId } = payload;
  const items = [...state.sessionState.items];
  const item = { ...items[itemId] };
  items[itemId] = item;

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

  // Set the choice delay of the question to 3 so it appears later
  item.choiceDelay = 3;

  // Put the modified `items` and `questions` arrays into the new state
  return {
    ...state,
    sessionState: {
      ...state.sessionState!,
      items
    },
    // Remove the currentQuestion so it can be re-assigned by chooseQuestion
    currentQuestion: null,
    // Reset the incorrectAnswer too
    incorrectAnswer: undefined,
    incorrectAnswerDigraphMatch: undefined
  };
};

export const SessionReducer = createReducer({} as State)
  // Start session
  .handleAction(actions.startSession, (state, { payload }): State => ({
    ...state,

    ongoing: true,
    sessionState: { ...payload },
    doingLessons: payload.withLessons || payload.type === "lesson",
    lessonCounter: 0,
    currentQuestion: null,
    incorrectAnswer: undefined,
    incorrectAnswerDigraphMatch: undefined,

    lastResults: undefined,
    lastResultsViewed: true
  }))
  // Previous lesson
  .handleAction(actions.prevLesson, (state): State => ({
    ...state,
    lessonCounter: Math.max(0, state.lessonCounter - 1)
  }))
  // Next lesson
  .handleAction(actions.nextLesson, (state): State => {
    const lessonCount = state.sessionState?.items.length || 0;
    const newCounter = Math.min(lessonCount, state.lessonCounter + 1);
    const finished = newCounter >= lessonCount;
    return {
      ...state,
      lessonCounter: finished ? 0 : newCounter,
      doingLessons: !finished
    };
  })
  // Set question
  .handleAction(actions.setQuestion, (state, { payload }): State => ({
    ...state,
    currentQuestion: payload
  }))
  // Set incorrect answer
  .handleAction(actions.setIncorrectAnswer, (state, { payload }): State => ({
    ...state,
    incorrectAnswer: payload?.answer,
    incorrectAnswerDigraphMatch: payload?.digraphMatch
  }))
  // Decrement choice delay for session items
  .handleAction(actions.decrChoiceDelay, (state): State => {
    if (!state.sessionState) return state;
    const items = state.sessionState.items;
    const newItems = [];
    for (const item of items) {
      if (item.choiceDelay > 0) {
        const newDelay = Math.max(0, item.choiceDelay - 1);
        debug("reducer decrementing choice delay for %d (%d -> %d)", item.subjectId, item.choiceDelay, newDelay);
        newItems.push({ ...item, choiceDelay: newDelay });
      } else {
        newItems.push(item);
      }
    }

    return {
      ...state,
      sessionState: {
        ...state.sessionState,
        items: newItems
      }
    };
  })
  // Answer question
  .handleAction(actions.answerQuestion, (state, { payload }): State => {
    if (!state.sessionState) return state;

    const { type, itemId, correct } = payload;
    const items = [...state.sessionState.items];
    const questions = [...state.sessionState.questions];

    // Clone the item so we can mutate it
    const item = { ...items[itemId] };
    items[itemId] = item;

    // Increment the answer counter (regardless of whether the question was
    // correct or not)
    item.numAnswers++;

    if (correct) {
      // Mark the question as correct
      if (type === "meaning") item.meaningCompleted = true;
      else if (type === "reading") item.readingCompleted = true;

      // Find the ID of the relevant question
      const questionId = questions.findIndex(q =>
        q.itemId === itemId && q.type === type);
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

      // Set the choice delay of the question to 3 so it appears later
      item.choiceDelay = 3;
    }

    // Put the modified `items` and `questions` arrays into the new state
    return {
      ...state,
      sessionState: {
        ...state.sessionState!,
        items,
        questions
      },

      // Remove the currentQuestion so it can be re-assigned by chooseQuestion
      // afterwards if necessary
      currentQuestion: null,
      // Reset the incorrectAnswer too
      incorrectAnswer: undefined,
      incorrectAnswerDigraphMatch: undefined
    };
  })
  // Skip the current question, specific behavior depends on the desired skip
  // setting.
  //   - DELAY - Put the question back into the same bucket with a choice delay
  //       of 3. In most cases it will appear later, but it may still appear
  //       immediately.
  //   - PUT_END - Put the question back into the highest bucket so that it
  //       appears at the end of the session, with a choice delay of 3.
  //   - REMOVE - Remove the item (both questions) from the session entirely.
  .handleAction(actions.skipQuestionDelay, delaySkipHandler(false))
  .handleAction(actions.skipQuestionPutEnd, delaySkipHandler(true))
  .handleAction(actions.skipQuestionRemove, (state, { payload }): State => {
    if (!state.sessionState) return state;

    // Clone the item so we can mutate it
    const { itemId } = payload;
    const items = [...state.sessionState.items];
    const item = { ...items[itemId] };
    items[itemId] = item;

    // Mark the item as abandoned
    item.abandoned = true;

    // Filter out the questions from this item
    const questions = state.sessionState.questions
      .filter(q => q.itemId !== itemId);

    // Put the modified `items` and `questions` arrays into the new state
    return {
      ...state,
      sessionState: {
        ...state.sessionState!,
        items,
        questions
      },
      // Remove the currentQuestion so it can be re-assigned by chooseQuestion
      currentQuestion: null,
      // Reset the incorrectAnswer too
      incorrectAnswer: undefined,
      incorrectAnswerDigraphMatch: undefined
    };
  })
  // Mark assignment as submitted
  .handleAction(actions.submitAssignment, (state, { payload }): State => {
    if (!state.sessionState) return state;

    // Clone the item so we can mutate it
    const items = [...state.sessionState.items];
    const item = { ...items[payload] };
    items[payload] = item;

    // Mark the session item as submitted
    item.submitted = true;

    // Put the modified `items` array into the new state
    return {
      ...state,
      sessionState: {
        ...state.sessionState!,
        items
      },
    };
  })
  // Wrap up the session by removing all un-started items
  .handleAction(actions.wrapUpSession, (state): State => {
    if (!state.sessionState) return state;

    // Clone the items to mark un-started ones as abandoned
    const oldItems = state.sessionState.items;
    const items: SessionItem[] = [];
    for (let i = 0; i < oldItems.length; i++) {
      const item = oldItems[i];

      if (!isItemStarted(item) && !isItemFinished(item)) {
        // If the item isn't started or finished yet, mark it as abandoned
        items.push({ ...item, abandoned: true });
      } else {
        // Otherwise, keep the item in the queue
        items.push(item);
      }
    }

    // Filter out questions from items that haven't been started yet
    const questions = state.sessionState.questions
      .filter(q => isItemStarted(items[q.itemId]));

    if (questions.length > 0) {
      // If there are still questions left, unset the current one, so that the
      // session page will select a new one
      return {
        ...state,
        sessionState: {
          ...state.sessionState!,
          items,
          questions
        },
        currentQuestion: null,
        incorrectAnswer: undefined,
        incorrectAnswerDigraphMatch: undefined
      };
    } else {
      // Otherwise, if the questions pool is now empty, end the session
      return endSessionState(state);
    }
  })
  .handleAction(actions.endSession, endSessionState)
  .handleAction(actions.setResultsViewed, (state, { payload }): State => ({
    ...state,
    lastResultsViewed: payload
  }))
  .handleAction(actions.studyQueueSetCollapsed, (state, { payload }): State => ({
    ...state, studyQueueCollapsed: payload
  }))
  .handleAction(actions.studyQueueAdd, (state, { payload }): State => {
    const newQueue = { ...state.studyQueue };
    for (const n of payload) newQueue[n] = 1;

    return {
      ...state,
      studyQueue: newQueue,
      studyQueueCollapsed: false
    };
  })
  .handleAction(actions.studyQueueRemove, (state, { payload }): State => {
    // Remove `without` from the study queue and get just the rest
    const { [payload]: without, ...rest } = state.studyQueue || {};
    return {
      ...state,
      studyQueue: Object.keys(rest).length > 0 ? rest : undefined,
      studyQueueCollapsed: false
    };
  })
  .handleAction(actions.studyQueueClear, (state): State => ({
    ...state,
    studyQueue: undefined,
    studyQueueCollapsed: false
  }));
