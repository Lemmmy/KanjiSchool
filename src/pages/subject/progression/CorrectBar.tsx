// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tag, Tooltip } from "antd";

import { CorrectBarTooltip } from "./CorrectBarTooltip";

import { nts } from "@utils";

interface Props {
  name: string;
  correct: number;
  incorrect: number;
  maxStreak?: number;
  currentStreak?: number;
}

export function CorrectBar({
  name,
  correct,
  incorrect,
  maxStreak,
  currentStreak
}: Props): JSX.Element | null {
  const total = correct + incorrect;
  if (!total) return null;

  const percentage = (correct / total) * 100;

  const showCurrentStreak = currentStreak !== undefined && currentStreak > 1;
  const showMaxStreak = maxStreak !== undefined && maxStreak > 1;
  const showStreakRow = showCurrentStreak || showMaxStreak;

  return <div className="correct-bar">
    <span className="title">{name}</span>

    {/* Streak row */}
    {showStreakRow && <div className="streak-row">
      {/* Current streak */}
      {showCurrentStreak && <span className="streak">
        Current streak
        <Tag className="streak-tag">{nts(currentStreak!)}</Tag>
      </span>}

      {/* Max streak */}
      {showMaxStreak && <span className="streak">
        Longest streak
        <Tag className="streak-tag">{nts(maxStreak!)}</Tag>
      </span>}
    </div>}

    {/* Bar */}
    <div className="bar-main">
      {/* Bar inner */}
      <Tooltip title={`${nts(correct)} / ${nts(total)}`}>
        <div className="bar-inner" style={{ width: percentage + "%" }} />
      </Tooltip>

      {/* Percentage tooltip */}
      <CorrectBarTooltip percentage={percentage} />
    </div>

    {/* Bar scale */}
    <div className="bar-scale">
      <span className="min">0</span>
      <span className="max">{nts(total)}</span>
    </div>
  </div>;
}
