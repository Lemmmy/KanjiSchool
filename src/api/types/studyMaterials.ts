// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiObject, ApiCollection, SubjectType } from "./";

// =============================================================================
// Study Materials
// =============================================================================
export interface ApiStudyMaterialInner {
  created_at: string;
  hidden: boolean;
  meaning_note: string | null;
  meaning_synonyms: string[];
  reading_note: string | null;
  subject_id: number;
  subject_type: SubjectType;
}
export interface ApiStudyMaterial extends ApiObject<ApiStudyMaterialInner> {
  id: number;
  object: "study_material";
}

export type ApiStudyMaterialMap = Record<number, ApiStudyMaterial>;
export type ApiStudyMaterialCollection = ApiCollection<ApiStudyMaterial>;
