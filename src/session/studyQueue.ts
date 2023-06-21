// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";
import { RootState } from "@store";
import { useSelector } from "react-redux";
import * as actions from "@actions/SessionActions";

import { lsSetObject } from "@utils";

export function addToStudyQueue(subjectIds: number | number[]): void {
  const ids = typeof subjectIds === "number" ? [subjectIds] : subjectIds;
  store.dispatch(actions.studyQueueAdd(ids));
  saveStudyQueue();
}

export function removeFromStudyQueue(subjectId: number): void {
  store.dispatch(actions.studyQueueRemove(subjectId));
  saveStudyQueue();
}

export function clearStudyQueue(): void {
  store.dispatch(actions.studyQueueClear());
  saveStudyQueue();
}

export function isInStudyQueue(subjectId: number): boolean {
  return !!store.getState().session.studyQueue?.[subjectId];
}

export const useIsInStudyQueue = (subjectId: number): boolean =>
  useSelector((s: RootState) => !!s.session.studyQueue?.[subjectId]);

export function saveStudyQueue(): void {
  const queue = store.getState().session.studyQueue;
  const keys = queue ? Object.keys(queue).map(k => parseInt(k)) : undefined;
  lsSetObject<number[]>("selfStudyQueue", keys?.length ? keys : undefined);
}
