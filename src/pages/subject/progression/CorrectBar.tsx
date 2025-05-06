// Copyright (c) 2021-2025 Drew Edwards
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
}: Props): React.ReactElement | null {
  const total = correct + incorrect;
  if (!total) return null;

  const percentage = (correct / total) * 100;

  const showCurrentStreak = currentStreak !== undefined && currentStreak > 1;
  const showMaxStreak = maxStreak !== undefined && maxStreak > 1;
  const showStreakRow = showCurrentStreak || showMaxStreak;

  const tagClass = "mt-px ml-xss text-sm font-normal";

  return <div className="mt-lg">
    <span className="font-bold">
      {name}
    </span>

    {/* Streak row */}
    {showStreakRow && <div className="mb-[3px] text-sm">
      {/* Current streak */}
      {showCurrentStreak && <span>
        Current streak
        <Tag className={tagClass}>{nts(currentStreak!)}</Tag>
      </span>}

      {/* Max streak */}
      {showMaxStreak && <span className="ml-sm">
        Longest streak
        <Tag className={tagClass}>{nts(maxStreak!)}</Tag>
      </span>}
    </div>}

    {/* Bar */}
    <div className="flex w-full h-[20px] bg-container rounded relative">
      {/* Bar inner */}
      <Tooltip title={`${nts(correct)} / ${nts(total)}`}>
        <div
          className="h-[20px] bg-primary hover:bg-blue-4 rounded cursor-pointer transition-colors"
          style={{ width: percentage + "%" }}
        />
      </Tooltip>

      {/* Percentage tooltip */}
      <CorrectBarTooltip percentage={percentage} />
    </div>

    {/* Bar scale */}
    <div className="w-full text-sm text-desc">
      <span>0</span>
      <span className="float-right">{nts(total)}</span>
    </div>
  </div>;
}
