// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { createAction } from "typesafe-actions";

import * as constants from "../constants";

import { SessionItem, SessionQuestion, SessionType } from "@session";
import { SessionOpts } from "@session/order/options";
import { DigraphMatch } from "@utils";

export interface StartSessionPayload {
  type: SessionType;
  uuid: string;
  items: SessionItem[];
  questions: SessionQuestion[];
  comparatorOptions: SessionOpts;
  withLessons?: boolean;
}
export const startSession = createAction(constants.START_SESSION)<StartSessionPayload>();

export const prevLesson = createAction(constants.SESSION_PREV_LESSON)();
export const nextLesson = createAction(constants.SESSION_NEXT_LESSON)();

export const setQuestion = createAction(constants.SESSION_SET_QUESTION)<number>();

export interface IncorrectAnswerPayload {
  answer: string;
  digraphMatch?: DigraphMatch;
}
export const setIncorrectAnswer = createAction(constants.SESSION_SET_INCORRECT_ANSWER)<IncorrectAnswerPayload | undefined>();
export const decrChoiceDelay = createAction(constants.SESSION_DECR_CHOICE_DELAY)();

export interface AnswerQuestionPayload {
  type: "meaning" | "reading";
  itemId: number;
  correct: boolean;
}
export const answerQuestion = createAction(constants.SESSION_ANSWER_QUESTION)<AnswerQuestionPayload>();

export type SkipQuestionPayload = Omit<AnswerQuestionPayload, "correct">;
export const skipQuestionDelay = createAction(constants.SESSION_SKIP_QUESTION_DELAY)<SkipQuestionPayload>();
export const skipQuestionPutEnd = createAction(constants.SESSION_SKIP_QUESTION_PUT_END)<SkipQuestionPayload>();
export const skipQuestionRemove = createAction(constants.SESSION_SKIP_QUESTION_REMOVE)<SkipQuestionPayload>();

export const submitAssignment = createAction(constants.SESSION_SUBMIT_ASSIGNMENT)<number>();

export const wrapUpSession = createAction(constants.SESSION_WRAP_UP)();
export const endSession = createAction(constants.END_SESSION)();
export const setResultsViewed = createAction(constants.SESSION_SET_RESULTS_VIEWED)<boolean>();

export const studyQueueSetCollapsed = createAction(constants.STUDY_QUEUE_SET_COLLAPSED)<boolean>();
export const studyQueueAdd = createAction(constants.STUDY_QUEUE_ADD)<number[]>();
export const studyQueueRemove = createAction(constants.STUDY_QUEUE_REMOVE)<number>();
export const studyQueueClear = createAction(constants.STUDY_QUEUE_CLEAR)();
