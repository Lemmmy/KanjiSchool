// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { updateStudyMaterial as updateStudyMaterialAction } from "@store/syncSlice.ts";

import * as api from "@api";
import { ApiStudyMaterial } from "@api";

import { db } from "@db";

import { Mutex } from "async-mutex";

export interface StudyMaterialPartial {
  meaningNote?: string | null;
  readingNote?: string | null;
  meaningSynonyms?: string[];
}

// Run one at a time, in order
const studyMaterialMutex = new Mutex();

export async function createStudyMaterial(
  subjectId: number,
  mate: StudyMaterialPartial
): Promise<ApiStudyMaterial> {
  return studyMaterialMutex.runExclusive(() =>
    _createStudyMaterial(subjectId, mate));
}
async function _createStudyMaterial(
  subjectId: number,
  mate: StudyMaterialPartial
): Promise<ApiStudyMaterial> {
  const res = await api.post<ApiStudyMaterial>("/study_materials", {
    study_material: {
      subject_id: subjectId,
      meaning_note: mate.meaningNote,
      reading_note: mate.readingNote,
      meaning_synonyms: mate.meaningSynonyms
    }
  });

  // Add the study material to the database and Redux store
  db.studyMaterials.put(res);
  store.dispatch(updateStudyMaterialAction(res));

  return res;
}

export async function updateStudyMaterial(
  studyMaterial: ApiStudyMaterial,
  mate: StudyMaterialPartial
): Promise<ApiStudyMaterial> {
  return studyMaterialMutex.runExclusive(() =>
    _updateStudyMaterial(studyMaterial, mate));
}
async function _updateStudyMaterial(
  studyMaterial: ApiStudyMaterial,
  mate: StudyMaterialPartial
): Promise<ApiStudyMaterial> {
  const url = `/study_materials/${encodeURIComponent(studyMaterial.id)}`;
  const res = await api.put<ApiStudyMaterial>(url, {
    study_material: {
      meaning_note: mate.meaningNote,
      reading_note: mate.readingNote,
      meaning_synonyms: mate.meaningSynonyms
    }
  });

  // Update the study material in the database and Redux store
  db.studyMaterials.put(res);
  store.dispatch(updateStudyMaterialAction(res));

  return res;
}
