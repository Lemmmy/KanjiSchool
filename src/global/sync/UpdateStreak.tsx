// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAssignments, useLastReview } from "@api";
import { useEffect } from "react";

import { calculateStreak } from "@pages/dashboard/summary/calculateStreak";

import Debug from "debug";
const debug = Debug("kanjischool:update-streak");

export function UpdateStreak(): JSX.Element | null {
  // When these update, auto-refresh the streak (debounced internally)
  const assignments = useAssignments();
  const lastReview = useLastReview();

  useEffect(() => {
    debug("updating streak");
    calculateStreak();
  }, [assignments, lastReview]);

  return null;
}
