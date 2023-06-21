// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiAssignment, ApiCollection, ApiObject, SubjectType } from "@api";

export interface ApiReviewInner {
  created_at: string;
  assignment_id: number;
  spaced_repetition_system_id: number;
  subject_id: number;
  starting_srs_stage: number;
  ending_srs_stage: number;
  incorrect_meaning_answers: number;
  incorrect_reading_answers: number;
}
export interface ApiReview extends ApiObject<ApiReviewInner> {
  id: number;
  object: "review";
}

export interface ApiReviewStatisticInner {
  created_at: string;
  hidden: boolean;

  meaning_correct: number;
  meaning_current_streak: number;
  meaning_incorrect: number;
  meaning_max_streak: number;
  reading_correct: number;
  reading_current_streak: number;
  reading_incorrect: number;
  reading_max_streak: number;

  /** Percentage correct can be calculated by rounding the result of
   * ((meaning_correct + reading_correct) / (meaning_correct + reading_correct +
   * meaning_incorrect + reading_incorrect)) * 100 */
  percentage_correct: number;

  subject_id: number;
  subject_type: SubjectType;
}
export interface ApiReviewStatistic extends ApiObject<ApiReviewStatisticInner> {
  id: number;
  object: "review_statistic";
}

export type ApiReviewStatisticCollection = ApiCollection<ApiReviewStatistic>;
export type ApiReviewStatisticMap = Record<number, ApiReviewStatistic>;

export interface ApiCreateReviewResponse extends ApiReview {
  resources_updated: {
    assignment: ApiAssignment;
    review_statistic: ApiReviewStatistic;
  };
}
