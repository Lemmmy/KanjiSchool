// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

import { ShortDuration } from "@comp/ShortDuration";
import { barTooltipColors, BarStageName } from "./srsBarColors.ts";

import { stringifySrsStage, stringifySrsStageShort } from "@utils";

interface Props {
  progress: number;
  stage: number;
  barStageName: BarStageName;
  availableNow: boolean;
  nextReview: string | null;
}

export function SrsStageCurrentTooltip({
  progress,
  stage,
  barStageName,
  availableNow,
  nextReview
}: Props): JSX.Element | null {
  const { sm } = useBreakpoint();

  return <div
    className="absolute -bottom-[44px] select-none z-50"
    style={{
      left: stage === 9
        ? "50%"
        : (progress * 100) + "%"
    }}
  >
    <div
      className={classNames(
        "relative -left-1/2 rounded whitespace-nowrap",
        barTooltipColors[barStageName],
        {
          "sm:min-w-[175px]": stage < 9,
        }
      )}
    >
      {/* Tooltip arrow */}
      <div
        className={classNames(
          "absolute left-1/2 top-0 w-[16px] h-[8px] clip-path-arrow-b -translate-x-1/2 -translate-y-full",
          barTooltipColors[barStageName]
        )}
      />

      {/* Current stage name + time remaining */}
      <div className="text-sm text-center py-xss px-xs" role="tooltip">
        {/* Stage name */}
        {sm
          ? stringifySrsStage(stage)
          : stringifySrsStageShort(stage)}

        {/* Time remaining */}
        {availableNow || nextReview ? " " : ""}
        <span
          className={classNames(
            "text-white/70",
            {
              "text-basec font-bold": availableNow,
              "light:text-black": stage === 7,
            }
          )}
        >
          {availableNow
            ? <>(due now)</>
            : (nextReview
              ? <>(<ShortDuration date={nextReview} /> left)</>
              : null)}
        </span>
      </div>
    </div>
  </div>;
}
