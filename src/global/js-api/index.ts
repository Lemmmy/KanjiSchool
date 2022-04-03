// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";
import { getAssignmentWithSubject, StoredAssignmentMap, StoredSubjectMap } from "@api";
import { isOverdue, getCharSymbol, getJpCharBlocks } from "@utils";
import { startSession } from "@session";

function getAssignments(): StoredAssignmentMap | undefined {
  return store.getState().sync.assignments;
}

function getSubjects(): StoredSubjectMap | undefined {
  return store.getState().sync.subjects;
}

(window as any).wk = {
  getStore: () => store,
  getAssignments,
  getSubjects,
  getAssignmentWithSubject,
  isOverdue,
  getCharSymbol,
  getJpCharBlocks,
  startSession
};
