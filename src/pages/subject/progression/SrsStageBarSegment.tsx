// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";
import classNames from "classnames";

import { getSrsProgress } from "./srsProgress.ts";
import { SrsStageCurrentTooltip } from "./SrsStageCurrentTooltip.tsx";
import { barColors, barHoverColors, BarStageName } from "./srsBarColors.ts";
import { getSrsStageBaseName, stringifySrsStage, stringifySrsStageDuration } from "@utils";

import { isPast, parseISO } from "date-fns";

interface Props {
  stage: number;
  unlocked: boolean;
  isCurrentStage: boolean;
  nextReview: string | null;
  systemId: number;
}

export function SrsStageBarSegment({
  stage,
  unlocked,
  isCurrentStage,
  nextReview,
  systemId
}: Props): JSX.Element {
  const availableNow = nextReview ? isPast(parseISO(nextReview)) : false;
  const progress = isCurrentStage
    ? getSrsProgress(systemId, stage, availableNow, nextReview)
    : (unlocked ? 1 : 0);

  const barStageName = getSrsStageBaseName(stage).toLowerCase() as BarStageName;
  const innerClass = classNames(
    "absolute top-0 left-0 w-full h-[40px] transition-[opacity,background-color]",
    "group-first:rounded-l group-last:rounded-r",
    barColors[barStageName],
    barHoverColors[barStageName]
  );

  // Bar segment and hover tooltip
  return <Tooltip
    title={<BarSegmentTooltip systemId={systemId} stage={stage} />}
    placement="top"
  >
    {/* Bar segment */}
    <div className="flex-1 h-[40px] mx-px cursor-pointer relative group">
      {/* Inner segment (locked background) */}
      <div className={classNames(innerClass, "opacity-50 hover:opacity-60")} />

      {/* Inner segment (for progress) */}
      {(unlocked || progress > 0) && <div
        className={innerClass}
        style={{ width: (progress * 100) + "%" }}
      />}

      {/* If this is the current stage (nextReview is available, or burned is
        * unlocked), then show the stage position tooltip too. */}
      {isCurrentStage && <SrsStageCurrentTooltip
        progress={progress}
        stage={stage}
        barStageName={barStageName}
        availableNow={availableNow}
        nextReview={nextReview}
      />}
    </div>
  </Tooltip>;
}

function BarSegmentTooltip(
  { systemId, stage }: Pick<Props, "systemId" | "stage">
): JSX.Element {
  const stageDuration = stage !== 9
    ? ` (${stringifySrsStageDuration(systemId, stage)})` : "";

  return <div className="text-center">
    {stringifySrsStage(stage)}
    {" "}
    {stageDuration && <span className="text-desc">{stageDuration}</span>}
  </div>;
}
