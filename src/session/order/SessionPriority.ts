// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { booleanCompare, queue, typeFirst, SubjectComparator } from "@utils/comparator";

/** The items in a session that should be given priority over the rest. */
export const SESSION_PRIORITIES = {
  /** None, all are treated equally. */
  NONE: <SessionPriorityType>{
    name: "None",
    getComparator: base => base
  },

  /** Radicals before others. */
  RADICALS_FIRST: <SessionPriorityType>{
    name: "Radicals first",
    getComparator: base => queue([typeFirst("radical"), base])
  },

  /** Kanji before others. */
  KANJI_FIRST: <SessionPriorityType>{
    name: "Kanji first",
    getComparator: base => queue([typeFirst("kanji"), base])
  },

  /** Vocabulary before others. */
  VOCABULARY_FIRST: <SessionPriorityType>{
    name: "Vocabulary first",
    getComparator: base => queue([typeFirst("vocabulary"), base])
  },

  /** Level-up progression path items first, i.e. current-level kanji and
   * radicals that keep those kanji locked, but only ones not passed yet. */
  LEVEL_UP_FIRST: <SessionPriorityType>{
    name: "Level-up items first",
    getComparator: (base, levelUpIds) => queue([
      ([aSubj, aAss], [bSubj, bAss]) => booleanCompare(
        !bAss?.data.passed_at && levelUpIds.has(bSubj.id),
        !aAss?.data.passed_at && levelUpIds.has(aSubj.id)
      ),
      base
    ])
  },

  /** Current-level radicals and kanji first. */
  CURRENT_LEVEL_RADICAL_KANJI_FIRST: <SessionPriorityType>{
    name: "Current-level radicals and kanji first",
    getComparator: (base, _, userLevel) => queue([
      ([aSubj], [bSubj]) => booleanCompare(
        bSubj.data.level === userLevel && bSubj.object !== "vocabulary",
        aSubj.data.level === userLevel && aSubj.object !== "vocabulary"
      ),
      base
    ])
  },

  /** Current-level items first. */
  CURRENT_LEVEL_FIRST: <SessionPriorityType>{
    name: "Current-level items first",
    getComparator: (base, _, userLevel) => queue([
      ([aSubj], [bSubj]) => booleanCompare(
        bSubj.data.level === userLevel,
        aSubj.data.level === userLevel
      ),
      base
    ])
  }
};

export interface SessionPriorityType {
  name: string;

  /**
   * Create a comparator that implements the rules for this session priority.
   *
   * @param base - The base comparator to delegate to if both argument subjects
   *   are equal.
   * @param levelUpIds - The IDs of subjects that are on the level-up
   *   progression path.
   * @param userLevel - The user's level.
   */
  getComparator: (
    base: SubjectComparator,
    levelUpIds: Set<number>,
    userLevel: number
  ) => SubjectComparator;
}
export type SessionPriority = keyof typeof SESSION_PRIORITIES;
