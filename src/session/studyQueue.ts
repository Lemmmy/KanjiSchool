// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { useAppSelector } from "@store";
import { studyQueueAdd, studyQueueClear, studyQueueRemove } from "@store/slices/sessionSlice.ts";

import { lsSetObject } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:study-queue");

export function addToStudyQueue(subjectIds: number | number[]): void {
  const ids = typeof subjectIds === "number" ? [subjectIds] : subjectIds;
  debug("adding to study queue:", ids);
  store.dispatch(studyQueueAdd(ids));
  saveStudyQueue();
}

export function removeFromStudyQueue(subjectId: number): void {
  debug("removing from study queue:", subjectId);
  store.dispatch(studyQueueRemove(subjectId));
  saveStudyQueue();
}

export function clearStudyQueue(): void {
  store.dispatch(studyQueueClear());
  saveStudyQueue();
}

export function isInStudyQueue(subjectId: number): boolean {
  return !!store.getState().session.studyQueue?.[subjectId];
}

export const useIsInStudyQueue = (subjectId: number): boolean =>
  useAppSelector(s => !!s.session.studyQueue?.[subjectId]);

export function saveStudyQueue(): void {
  const queue = store.getState().session.studyQueue;
  const keys = queue ? Object.keys(queue).map(k => parseInt(k)) : undefined;
  lsSetObject<number[]>("selfStudyQueue", keys?.length ? keys : undefined);
}
