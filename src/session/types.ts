// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SessionOpts } from "./order/options";

export type SessionType = "lesson" | "review" | "self_study";

export interface SessionItem {
  meaningCompleted: boolean;
  meaningIncorrectAnswers: number;
  readingCompleted: boolean;
  readingIncorrectAnswers: number;
  submitted: boolean;

  subjectId: number;
  assignmentId?: number;

  bucket: number;
  order: number;

  numAnswers: number;
  choiceDelay: number;
  putEnd?: boolean;

  // Whether or not this item has been removed from the queue (unstarted items
  // after wrapping up)
  abandoned: boolean;
}

/** SessionItem that definitely has an assignment. */
export type SessionItemWithAssignment = SessionItem & { assignmentId: number };

export function sessionHasAssignment(item: SessionItem): item is SessionItemWithAssignment {
  return item.assignmentId !== undefined;
}

export interface SessionState {
  type: SessionType;
  uuid: string;

  items: SessionItem[];
  questions: SessionQuestion[];

  comparatorOptions: SessionOpts;
}

export interface SessionQuestion {
  type: "meaning" | "reading";
  itemId: number;
}

export interface SessionResults {
  type: SessionType;
  uuid: string;
  completedAt: string;

  correctSubjectIds: number[];
  incorrectSubjectIds: number[];
}
