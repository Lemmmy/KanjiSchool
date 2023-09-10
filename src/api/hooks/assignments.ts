// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import {
  StoredAssignmentMap, SubjectAssignmentIdMap, StoredAssignment,
  StoredSubjectMap, AssignmentWithSubject
} from "@api";

export const useAssignments = (): StoredAssignmentMap | undefined =>
  useAppSelector(s => s.sync.assignments);

export const useSubjectAssignmentIds = (): SubjectAssignmentIdMap =>
  useAppSelector(s => s.sync.subjectAssignmentIdMap);

export const useAssignmentBySubjectId = (id: number): StoredAssignment | undefined =>
  useAppSelector(
    s => s.sync.assignments?.[s.sync.subjectAssignmentIdMap?.[id]],
    shallowEqual
  );

export function getAssignmentBySubject(
  assignments: StoredAssignmentMap | undefined,
  subjectId: number
): StoredAssignment | undefined {
  if (!assignments) return;

  for (const assignmentId in assignments) {
    const assignment = assignments[assignmentId];

    if (assignment.data.internalShouldShow &&
      assignment.data.subject_id === subjectId) {
      return assignment;
    }
  }
}

export function getAssignmentWithSubject(
  subjects: StoredSubjectMap,
  assignment: StoredAssignment
): AssignmentWithSubject {
  const subject = subjects[assignment.data.subject_id];
  return { ...assignment, subject };
}
