// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";
import classNames from "classnames";

import { StoredSubject, StoredAssignment } from "@api";

import { srsSystems } from "@data";
import { getSrsStageBaseName, stringifySrsStage, stringifySrsStageDuration } from "@utils";
import { isPast, parseISO } from "date-fns";

import { SrsStageCurrentTooltip } from "./SrsStageCurrentTooltip";
import { getSrsProgress } from "./srsProgress";

interface Props {
  subject: StoredSubject;
  assignment: StoredAssignment;
}

const STAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function SrsStageBar({
  subject,
  assignment
}: Props): JSX.Element | null {
  const nextReview = assignment.data.available_at;
  const stage = assignment.data.srs_stage;

  const systemId = subject.data.spaced_repetition_system_id;
  const system = srsSystems[systemId];
  if (!system) return null;

  return <div className="srs-stage-bar">
    <span className="title">SRS stage</span>

    <Tooltip title={system.data.description}>
      <span className="system">{system.data.name}</span>
    </Tooltip>

    {/* Bar segments */}
    <div className="bar-main">
      {STAGES.map(i => <BarSegment
        key={i} stage={i}
        unlocked={stage >= i}
        isCurrentStage={stage === i}
        nextReview={stage === i ? nextReview : null}
        systemId={systemId}
      />)}
    </div>
  </div>;
}

interface BarSegmentProps {
  stage: number;
  unlocked: boolean;
  isCurrentStage: boolean;
  nextReview: string | null;
  systemId: number;
}

function BarSegment({
  stage, unlocked, isCurrentStage, nextReview, systemId
}: BarSegmentProps): JSX.Element {
  const availableNow = nextReview ? isPast(parseISO(nextReview)) : false;
  const progress = isCurrentStage
    ? getSrsProgress(systemId, stage, availableNow, nextReview)
    : (unlocked ? 1 : 0);

  const stageClass = "stage-" + getSrsStageBaseName(stage).toLowerCase();
  const classes = classNames(
    "bar-segment",
    stageClass,
    { unlocked }
  );

  // Bar segment and hover tooltip
  return <Tooltip
    title={<BarSegmentTooltip systemId={systemId} stage={stage} />}
    placement="top"
  >
    {/* Bar segment */}
    <div className={classes}>
      {/* Inner segment (background) */}
      <div className={"bar-segment-inner bar-segment-bg " + stageClass} />

      {/* Inner segment (for progress) */}
      {(unlocked || progress > 0) && <div
        className={"bar-segment-inner bar-segment-progress " + stageClass}
        style={{ width: (progress * 100) + "%" }}
      />}

      {/* If this is the current stage (nextReview is available, or burned is
        * unlocked), then show the stage position tooltip too. */}
      {isCurrentStage && <SrsStageCurrentTooltip
        progress={progress} stage={stage} stageClass={stageClass}
        availableNow={availableNow} nextReview={nextReview}
      />}
    </div>
  </Tooltip>;
}

function BarSegmentTooltip(
  { systemId, stage }: Pick<BarSegmentProps, "systemId" | "stage">
): JSX.Element {
  const stageDuration = stage !== 9
    ? ` (${stringifySrsStageDuration(systemId, stage)})` : "";

  return <div className="srs-stage-bar-segment-tooltip">
    {stringifySrsStage(stage)}
    {" "}
    {stageDuration && <span className="stage-duration">{stageDuration}</span>}
  </div>;
}
