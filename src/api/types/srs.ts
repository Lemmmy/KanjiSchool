// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiCollection, ApiObject } from "@api";

export interface ApiSrsStage {
  /**
   * The length of time added to the time of review registration, adjusted to
   * the beginning of the hour.
   *
   * The unlocking (position 0) and burning (maximum position) will always have
   * null for interval and interval_unit since the stages do not influence
   * assignment.available_at. Stages in between the unlocking and burning stages
   * are the “reviewable” stages.
   */
  interval: number | null;
  /** Unit of time. Can be the following: milliseconds, seconds, minutes, hours,
   * days, and weeks. */
  interval_unit: string | null;
  /** The position of the stage within the continuous order. */
  position: number;
}

export interface ApiSpacedRepetitionSystemInner {
  /** Timestamp when the spaced_repetition_system was created. */
  created_at: string;
  /** The name of the spaced repetition system. */
  name: string;
  /** Details about the spaced repetition system. */
  description: string;
  /** `position` of the unlocking stage. */
  unlocking_stage_position: number;
  /** `position` of the starting stage. */
  starting_stage_position: number;
  /** `position` of the passing stage. */
  passing_stage_position: number;
  /** `position` of the burning stage. */
  burning_stage_position: number;
  /** A collection of stages. */
  stages: ApiSrsStage[];
}

export interface ApiSpacedRepetitionSystem extends ApiObject<ApiSpacedRepetitionSystemInner> {
  id: number;
  object: "spaced_repetition_system";
}

export type ApiSpacedRepetitionSystems = ApiCollection<ApiSpacedRepetitionSystem>;
