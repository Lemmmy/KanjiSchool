// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiObject } from "./";

export interface ApiSummarySubjects {
  available_at: string;
  subject_ids: number[];
}
export type ApiSummaryLessons = ApiSummarySubjects;
export type ApiSummaryReviews = ApiSummarySubjects;

export interface ApiSummaryInner {
  lessons: ApiSummaryLessons[];
  next_reviews_at: string | null;
  reviews: ApiSummaryReviews[];
}
export interface ApiSummary extends ApiObject<ApiSummaryInner> {
  object: "report";
}
