// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { queue, byLevel, byType, byNextReview, bySrs, SubjectComparator } from "@utils/comparator";

/** The sort order for advanced search. */
export const SEARCH_ORDERS = {
  /** By type. */
  TYPE: <SearchOrderType>{
    name: "Type",
    getComparator: () => byType()
  },

  /** First by level, then by type. */
  LEVEL_THEN_TYPE: <SearchOrderType>{
    name: "Level, then type",
    getComparator: () => queue([byLevel(), byType()])
  },

  /** First by next review time, then by type. */
  NEXT_REVIEW_THEN_TYPE: <SearchOrderType>{
    name: "Next review, then type",
    getComparator: () => queue([byNextReview(), byType()])
  },

  /** First by SRS stage, then by type. */
  SRS_THEN_TYPE: <SearchOrderType>{
    name: "SRS stage, then type",
    getComparator: () => queue([bySrs(), byType()])
  },
};

export interface SearchOrderType {
  name: string;
  getComparator: () => SubjectComparator;
}
export type SearchOrder = keyof typeof SEARCH_ORDERS;
