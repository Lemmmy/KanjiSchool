// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { queue, byLevel, bySrs, byType, shuffleComparator, SubjectComparator } from "@utils/comparator";

/** The order to present reviews/self-study in. Each value will produce a
 * comparator on demand. */
export const REVIEW_ORDERS = {
  /** Completely random order, i.e. the comparator always returns 0 and doesn't
   * impose an order. */
  SHUFFLE: <ReviewOrderType>{
    name: "Shuffle",
    getComparator: () => shuffleComparator()
  },

  /** By level. */
  LEVEL: <ReviewOrderType>{
    name: "Level",
    getComparator: () => byLevel()
  },

  /** By type. */
  TYPE: <ReviewOrderType>{
    name: "Type",
    getComparator: () => byType()
  },

  /** By SRS stage. */
  SRS: <ReviewOrderType>{
    name: "SRS stage",
    getComparator: () => bySrs()
  },

  /** By level, then by type. */
  LEVEL_THEN_TYPE: <ReviewOrderType>{
    name: "Level, then type",
    getComparator: () => queue([byLevel(), byType()])
  },

  /** By level, then by SRS stage. */
  LEVEL_THEN_SRS: <ReviewOrderType>{
    name: "Level, then SRS stage",
    getComparator: () => queue([byLevel(), bySrs()])
  },

  /** By level, then by SRS stage. */
  TYPE_THEN_LEVEL: <ReviewOrderType>{
    name: "Type, then level",
    getComparator: () => queue([byType(), byLevel()])
  },

  /** By type, then by SRS stage. */
  TYPE_THEN_SRS: <ReviewOrderType>{
    name: "Type, then SRS stage",
    getComparator: () => queue([byType(), bySrs()])
  },

  /** By SRS stage, then by type. */
  SRS_THEN_TYPE: <ReviewOrderType>{
    name: "SRS stage, then type",
    getComparator: () => queue([bySrs(), byType()])
  },

  /** By SRS stage, then by level. */
  SRS_THEN_LEVEL: <ReviewOrderType>{
    name: "SRS stage, then level",
    getComparator: () => queue([bySrs(), byLevel()])
  },

  /** By level, then by type, then by SRS stage. */
  LEVEL_THEN_TYPE_THEN_SRS: <ReviewOrderType>{
    name: "Level, then type, then SRS stage",
    getComparator: () => queue([byLevel(), byType(), bySrs()])
  },

  /** By level, then by SRS stage, then by type. */
  LEVEL_THEN_SRS_THEN_TYPE: <ReviewOrderType>{
    name: "Level, then SRS stage, then type",
    getComparator: () => queue([byLevel(), bySrs(), byType()])
  },

  /** By type, then by level, then by SRS stage. */
  TYPE_THEN_LEVEL_THEN_SRS: <ReviewOrderType>{
    name: "Type, then level, then SRS stage",
    getComparator: () => queue([byType(), byLevel(), bySrs()])
  },

  /** By type, then by SRS stage, then by level. */
  TYPE_THEN_SRS_THEN_LEVEL: <ReviewOrderType>{
    name: "Type, then SRS stage, then level",
    getComparator: () => queue([byType(), bySrs(), byLevel()])
  },

  /** By SRS stage, then by type, then by level. */
  SRS_THEN_TYPE_THEN_LEVEL: <ReviewOrderType>{
    name: "SRS stage, then type, then level",
    getComparator: () => queue([bySrs(), byType(), byLevel()])
  },

  /** By SRS stage, then by level, then by type. */
  SRS_THEN_LEVEL_THEN_TYPE: <ReviewOrderType> {
    name: "SRS stage, then level, then type",
    getComparator: () => queue([bySrs(), byLevel(), byType()])
  },
};

export interface ReviewOrderType {
  name: string;
  getComparator: () => SubjectComparator;
}
export type ReviewOrder = keyof typeof REVIEW_ORDERS;
