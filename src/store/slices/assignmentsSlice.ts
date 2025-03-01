// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OverleveledAssignments, StoredAssignment, StoredAssignmentMap, SubjectAssignmentIdMap } from "@api";

export interface AssignmentsSliceState {
  readonly assignments?: StoredAssignmentMap;
  readonly subjectAssignmentIdMap: SubjectAssignmentIdMap;
  readonly overleveledAssignments: OverleveledAssignments | null;
}

const initialState = (): AssignmentsSliceState => ({
  assignments: undefined,
  subjectAssignmentIdMap: {},
  overleveledAssignments: null,
});

const assignmentsSlice = createSlice({
  name: "assignments",
  initialState,
  reducers: {
    // Initialise assignment map from database. Also sets up the subject ID to assignment ID map.
    initAssignments(s, { payload }: PayloadAction<StoredAssignmentMap>) {
      const subjectAssignmentIdMap: SubjectAssignmentIdMap = {};
      for (const assignmentId in payload) {
        const assignment = payload[assignmentId];
        subjectAssignmentIdMap[assignment.data.subject_id] = assignment.id;
      }

      s.assignments = payload;
      s.subjectAssignmentIdMap = subjectAssignmentIdMap;
    },

    // Update an individual assignment. Also updates the subject ID to assignment map.
    updateAssignment(s, { payload }: PayloadAction<StoredAssignment>) {
      const { id, data } = payload;
      s.assignments![id] = payload;
      s.subjectAssignmentIdMap[data.subject_id] = id;
    },

    // Set overleveled lessons and reviews. This is used to show a warning to the user if they have lessons or reviews
    // that are overleveled.
    setOverleveledAssignments(s, { payload }: PayloadAction<OverleveledAssignments | null>) {
      s.overleveledAssignments = payload;
    },
  }
});

export const {
  initAssignments,
  updateAssignment,
  setOverleveledAssignments
} = assignmentsSlice.actions;

export default assignmentsSlice.reducer;
