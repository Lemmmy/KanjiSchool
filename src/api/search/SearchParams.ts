// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectType } from "@api";
import { SearchOrder } from "./SearchOrder";
import { JlptLevels, JoyoGrades } from "@data";

export interface SearchParams {
  // Min/max level from subject
  minLevel?: number;
  maxLevel?: number;

  // Min/max newspaper frequency from subject Jisho data
  minFreq?: number;
  maxFreq?: number;

  // TODO: Leeches calculated from review statistics
  // onlyLeeches?: boolean;

  // Percentage correct less than/more than
  percentageCorrectLt?: number;
  percentageCorrectGt?: number;

  // Next review less than/more than n hours ago
  nextReviewLt?: number;
  nextReviewGt?: number;

  // Incorrect answer less than n hours ago
  // TODO: Store last incorrect answer
  // incorrectAnswerLt?: number;

  // Burned less than/more than n days ago
  burnedLt?: number;
  burnedGt?: number;

  // SRS stages allow-list
  srsStages?: number[];
  // Subject types allow-list
  subjectTypes?: SubjectType[];
  // JLPT levels allow-list
  jlptLevels?: (JlptLevels | -1)[];
  // Jōyō grades allow-list
  joyoGrades?: (JoyoGrades | -1)[];
  // Vocabulary parts of speech allow-list
  partsOfSpeech?: string[];

  // Order for results and grouping
  sortOrder: SearchOrder;

  // Keyword search query
  query?: string;
}

export const SEARCH_PARAM_KEYS: (keyof SearchParams)[] = [
  "minLevel", "maxLevel", "minFreq", "maxFreq", "nextReviewLt", "nextReviewGt",
  "burnedLt", "burnedGt", "srsStages", "subjectTypes", "jlptLevels",
  "joyoGrades", "partsOfSpeech", "sortOrder", "query",
  "percentageCorrectLt", "percentageCorrectGt"
];

/**
 * Replaces any 'null' or empty string values in SearchParams with `undefined`.
 * If `returnNull` is true, all the values will be set to `null` instead.
 */
export function normalizeSearchParams(
  params: SearchParams,
  returnNull?: boolean
): SearchParams {
  const out: any = {};
  for (const k of SEARCH_PARAM_KEYS) {
    const v = params[k];
    out[k] = v !== undefined && v !== null && v !== ""
      ? v
      : (returnNull ? null : undefined);
  }
  return out;
}
