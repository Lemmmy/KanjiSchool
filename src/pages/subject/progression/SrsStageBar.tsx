// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";
import classNames from "classnames";

import { StoredAssignment, StoredSubject } from "@api";

import { srsSystems } from "@data";
import { SrsStageBarSegment } from "@pages/subject/progression/SrsStageBarSegment.tsx";

interface Props {
  subject: StoredSubject;
  assignment: StoredAssignment;
}

const STAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function SrsStageBar({
  subject,
  assignment
}: Props): React.ReactElement | null {
  const nextReview = assignment.data.available_at;
  const stage = assignment.data.srs_stage;

  const systemId = subject.data.spaced_repetition_system_id;
  const system = srsSystems[systemId];
  if (!system) return null;

  return <div className={classNames(
    "leading-[25.144px]", // Force the smaller system text to vertically align to the bottom
    "mb-[64px]", // Tooltip size (40px) + margin (lg, 24px)
  )}>
    <b>SRS stage</b>

    {/* SRS system used */}
    <Tooltip title={system.data.description}>
      <span className="float-right text-sm text-desc">
        {system.data.name}
      </span>
    </Tooltip>

    {/* Bar segments */}
    <div className="flex w-full h-[40px]">
      {STAGES.map(i => <SrsStageBarSegment
        key={i} stage={i}
        unlocked={stage >= i}
        isCurrentStage={stage === i}
        nextReview={stage === i ? nextReview : null}
        systemId={systemId}
      />)}
    </div>
  </div>;
}

