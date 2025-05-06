// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { useNavigate } from "react-router-dom";

import { gotoSearch } from "@api";
import { getSrsStageBaseName, nts } from "@utils";

import { StageData } from "./SrsStagesCard";
import { baseStageClasses, srsStageClasses } from "./styles.ts";

interface SrsStageProps {
  stageData?: StageData;
  min: number;
  max?: number;
}

export function SrsStage({ stageData, min, max }: SrsStageProps): React.ReactElement {
  const navigate = useNavigate();

  if (max === undefined)
    max = min;
  const stageName = getSrsStageBaseName(min);

  // Sum up the assignment count for all the stages in this range
  const stages: number[] = []; // The list of stage numbers in this range
  let count = 0;
  for (let i = min; i <= max; i++) {
    stages.push(i);
    count += stageData?.[i] ?? 0;
  }

  function onClick() {
    gotoSearch(navigate, {
      srsStages: stages,
      sortOrder: "SRS_THEN_TYPE"
    }, true, true);
  }

  const classes = classNames(baseStageClasses, srsStageClasses[stageName]);

  return <div className={classes} onClick={onClick}>
    <div>{stageName}</div>
    <div className="text-4xl">{nts(count)}</div>
  </div>;
}
