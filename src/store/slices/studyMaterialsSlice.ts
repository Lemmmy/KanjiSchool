// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiStudyMaterial, ApiStudyMaterialMap, SubjectStudyMaterialIdMap } from "@api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface StudyMaterialsSliceState {
  readonly studyMaterials: ApiStudyMaterialMap;
  readonly subjectStudyMaterialIdMap: SubjectStudyMaterialIdMap;
}

const initialState = (): StudyMaterialsSliceState => ({
  studyMaterials: {},
  subjectStudyMaterialIdMap: {},
});

const studyMaterialsSlice = createSlice({
  name: "studyMaterials",
  initialState,
  reducers: {
    // Initialise study materials map from database. Also sets up the subject ID to study material ID map.
    initStudyMaterials(s, { payload }: PayloadAction<ApiStudyMaterialMap>) {
      const subjectStudyMaterialIdMap: SubjectStudyMaterialIdMap = {};
      for (const studyMaterialId in payload) {
        const studyMaterial = payload[studyMaterialId];
        subjectStudyMaterialIdMap[studyMaterial.data.subject_id] = studyMaterial.id;
      }

      s.studyMaterials = payload;
      s.subjectStudyMaterialIdMap = subjectStudyMaterialIdMap;
    },

    // Update an individual study material. Also updates the subject ID to study material ID map.
    updateStudyMaterial(s, { payload }: PayloadAction<ApiStudyMaterial>) {
      const { id, data } = payload;
      s.studyMaterials![id] = payload;
      s.subjectStudyMaterialIdMap[data.subject_id] = id;
    },
  }
});

export const {
  initStudyMaterials,
  updateStudyMaterial
} = studyMaterialsSlice.actions;

export default studyMaterialsSlice.reducer;
