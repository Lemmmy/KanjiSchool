// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";
import classNames from "classnames";

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { nts, useBooleanSetting } from "@utils";

export function Streak(): JSX.Element | null {
  const showStreak = useBooleanSetting("dashboardCurrentStreak");

  const { currentStreak, maxStreak, todayInStreak } =
    useSelector((s: RootState) => s.sync.streak, shallowEqual);

  // Don't clutter if nothing useful to say
  if (!showStreak) return null;
  if (currentStreak === 0 && maxStreak === 0) return null;

  const classes = classNames("level-info-part streak", {
    "current-zero": currentStreak === 0,
    "today-in-streak": todayInStreak
  });

  return <div className={classes}>
    <span className="label">Streak: </span>
    <Tooltip title="Current streak">
      <span className="streak-current">{nts(currentStreak ?? 0)}</span>
    </Tooltip>
    &nbsp;/&nbsp;
    <Tooltip title="Highest streak">
      <span className="streak-max">{nts(maxStreak ?? 0)}</span>
    </Tooltip>
  </div>;
}
