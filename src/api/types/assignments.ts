// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiObject, ApiCollection, SubjectType } from "./";

export interface ApiAssignmentInner {
  available_at: string | null;
  burned_at: string | null;
  created_at: string;
  hidden: boolean;
  passed_at: string | null;
  resurrected_at: string | null;
  srs_stage: number;
  started_at: string | null;
  subject_id: number;
  subject_type: SubjectType;
  unlocked_at: string | null;
}
export interface ApiAssignment extends ApiObject<ApiAssignmentInner> {
  id: number;
  object: "assignment";
}

export type ApiAssignmentCollection = ApiCollection<ApiAssignment>;
export type ApiAssignmentMap = Record<number, ApiAssignment>;
