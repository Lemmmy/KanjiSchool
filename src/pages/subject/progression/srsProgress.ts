// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { getSrsSystemStageDurationSeconds } from "@utils";
import dayjs from "dayjs";

export function getSrsProgress(
  systemId: number,
  stage: number,
  availableNow: boolean,
  nextReview: string | null
): number {
  // If the review is available now, the position is 100%. Otherwise, it needs
  // to be calculated by subtracting the SRS stage duration from the next review
  // date, and then interpolating, because the assignment does not give us the
  // last review time.
  if (availableNow || !nextReview) return 1.0;

  const nextReviewDate = dayjs(nextReview);

  const durationSeconds = getSrsSystemStageDurationSeconds(systemId, stage);
  const progressSeconds = nextReviewDate.diff(dayjs(), "second");

  return 1 - (progressSeconds / durationSeconds);
}
