// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { queue, byLevel, byType, typeFirst, shuffleComparator, SubjectComparator } from "@utils/comparator";

/** The order to present lessons in. Each value will produce a comparator on
 * demand. */
export const LESSON_ORDERS = {
  /** Completely random order, i.e. the comparator always returns 0 and doesn't
   * impose an order. */
  SHUFFLE: <LessonOrderType>{
    name: "Shuffle",
    shuffle: true,
    getComparator: () => shuffleComparator()
  },

  /** First by level, then by type. */
  LEVEL_THEN_TYPE: <LessonOrderType>{
    name: "Level, then type",
    getComparator: () => queue([byLevel(), byType()])
  },

  /** First radicals, then for the rest first by level, then by type. */
  RADICALS_THEN_LEVEL_THEN_TYPE: <LessonOrderType>{
    name: "Radicals, then level, then type",
    getComparator: () => queue([typeFirst("radical"), byLevel(), byType()])
  },

  /** First by type, then by level. */
  TYPE_THEN_LEVEL: <LessonOrderType>{
    name: "Type, then level",
    getComparator: () => queue([byType(), byLevel()])
  },

  /** First by level, then shuffle. */
  LEVEL_THEN_SHUFFLE: <LessonOrderType>{
    name: "Level, then shuffle",
    shuffle: true,
    getComparator: () => byLevel()
  },

  /** First by type, then shuffle. */
  TYPE_THEN_SHUFFLE: <LessonOrderType>{
    name: "Type, then shuffle",
    shuffle: true,
    getComparator: () => byType()
  }
};

export interface LessonOrderType {
  name: string;
  shuffle: boolean;
  getComparator: () => SubjectComparator;
}
export type LessonOrder = keyof typeof LESSON_ORDERS;
