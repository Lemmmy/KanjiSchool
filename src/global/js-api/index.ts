// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { getAssignmentWithSubject, StoredAssignmentMap, StoredSubjectMap } from "@api";
import { isOverdue, getCharSymbol, getJpCharBlocks } from "@utils";
import { startSession } from "@session";
import { db } from "@db";

function getAssignments(): StoredAssignmentMap | undefined {
  return store.getState().assignments.assignments;
}

function getSubjects(): StoredSubjectMap | undefined {
  return store.getState().subjects.subjects;
}

async function resetOverlevelAssignment(assignmentId: number) {
  const assignment = store.getState().assignments.assignments?.[assignmentId];
  if (!assignment) throw new Error("Assignment not found");

  await db.assignments.update(assignmentId, {
    ...assignment,
    data: {
      ...assignment.data,
      internalOverLevel: false
    }
  });
}

(window as any).wk = {
  getStore: () => store,
  getAssignments,
  getSubjects,
  getAssignmentWithSubject,
  isOverdue,
  getCharSymbol,
  getJpCharBlocks,
  startSession,
  resetOverlevelAssignment
};

