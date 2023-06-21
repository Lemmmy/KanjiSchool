// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ShortDuration } from "@comp/ShortDuration";
import { stringifySrsStage } from "@utils";

interface Props {
  progress: number;
  stage: number;
  stageClass: string;
  availableNow: boolean;
  nextReview: string | null;
}

export function SrsStageCurrentTooltip({
  progress,
  stage,
  stageClass,
  availableNow,
  nextReview
}: Props): JSX.Element | null {
  return <div
    className={"current-stage-tooltip " + stageClass}
    style={{ left: (progress * 100) + "%" }}
  >
    {/* Fake ant tooltip contents */}
    <div className="ant-tooltip ant-tooltip-placement-bottom">
      <div className="ant-tooltip-content">
        <div className="ant-tooltip-arrow">
          <span className={"ant-tooltip-arrow-content " + stageClass} />
        </div>

        {/* Current stage name + time remaining */}
        <div className={"ant-tooltip-inner " + stageClass} role="tooltip">
          {/* Stage name */}
          {stringifySrsStage(stage)}

          {/* Time remaining */}
          {availableNow || nextReview ? " " : ""}
          <span className={"time-remaining" + (availableNow ? " now" : "")}>
            {availableNow
              ? <>(due now)</>
              : (nextReview
                ? <>(<ShortDuration date={nextReview} /> left)</>
                : null)}
          </span>
        </div>
      </div>
    </div>
  </div>;
}
