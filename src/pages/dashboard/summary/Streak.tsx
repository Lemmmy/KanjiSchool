// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import { LevelInfoRowPart } from "@pages/dashboard/summary/LevelInfoRowPart.tsx";
import { nts, useBooleanSetting } from "@utils";

export function Streak(): React.ReactElement | null {
  const showStreak = useBooleanSetting("dashboardCurrentStreak");

  const { currentStreak, maxStreak, todayInStreak } =
    useAppSelector(s => s.reviews.streak, shallowEqual);

  // Don't clutter if nothing useful to say
  if (!showStreak) return null;
  if (currentStreak === 0 && maxStreak === 0) return null;

  const streakColor = currentStreak === 0
    ? "text-red"
    : todayInStreak
      ? "text-green"
      : "text-yellow light:text-orange-6";

  return <LevelInfoRowPart label="Streak">
    <Tooltip title="Current streak">
      <span className={streakColor}>{nts(currentStreak ?? 0)}</span>
    </Tooltip>
    &nbsp;/&nbsp;
    <Tooltip title="Highest streak">
      {nts(maxStreak ?? 0)}
    </Tooltip>
  </LevelInfoRowPart>;
}
