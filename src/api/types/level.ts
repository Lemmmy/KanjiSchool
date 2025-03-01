// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiObject, ApiCollection } from "./";

/**
 * Level progressions contain information about a user's progress through the
 * WaniKani levels.
 *
 * A level progression is created when a user has met the prerequisites for
 * leveling up, which are:
 *
 * - Reach a 90% passing rate on assignments for a user's current level with a
 *   `subject_type` of `kanji`. Passed assignments have `data.passed` equal to
 *   `true` and a `data.passed_at` that's in the past.
 *
 * - Have access to the level. Under `/user`, the `data.level` must be less than
 *   or equal to `data.subscription.max_level_granted`.
 */
export interface ApiLevelProgressionInner {
  /** The level of the progression, with possible values from 1 to 60. */
  level: number;

  /** Timestamp when the level progression is created. */
  created_at: string;

  /** Timestamp when the user can access lessons and reviews for the level. */
  unlocked_at: string | null;

  /** Timestamp when the user starts their first lesson of a subject belonging
   * to the level. */
  started_at: string | null;

  /** Timestamp when the user passes at least 90% of the assignments wiht a type
   * of `kanji` belonging to the associated subject's level. */
  passed_at: string | null;

  /** Timestamp when the user burns 100% of the assignments belonging to the
   * associated subject's level. */
  completed_at: string | null;

  /** Timestamp when the user abandons the level. This is primarily used when
   * the user initiates a reset. */
  abandoned_at: string | null;
}

export interface ApiLevelProgression extends ApiObject<ApiLevelProgressionInner> {
  id: number;
  object: "level_progression";
}

export type ApiLevelProgressionMap = Record<number, ApiLevelProgression>;
export type ApiLevelProgressionCollection = ApiCollection<ApiLevelProgression>;
