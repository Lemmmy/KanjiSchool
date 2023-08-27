// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { useNavigate } from "react-router-dom";

import { gotoSearch } from "@api";
import { nts } from "@utils";
import { baseStageClasses } from "@pages/dashboard/srs-stages/SrsStagesCard.tsx";

type KnownSmallType = "inProgress" | "passed" | "total";
interface KnownSmallProps {
  type: KnownSmallType;
  name: string;
  count: number;
}

const KNOWN_SMALL_STAGES: Record<KnownSmallType, number[]> = {
  inProgress: [1, 2, 3, 4],
  passed: [5, 6, 7, 8, 9],
  total: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
};

const typeClasses: Record<KnownSmallType, string> = {
  inProgress: "bg-srs-apprentice hover:bg-srs-apprentice-lighter",
  passed:     "text-white bg-srs-passed hover:bg-srs-passed-lighter",
  total:      "text-white bg-white/8 hover:bg-white/15"
};

export function KnownSmall({
  type, name, count
}: KnownSmallProps): JSX.Element {
  const navigate = useNavigate();

  function onClick() {
    gotoSearch(navigate, { srsStages: KNOWN_SMALL_STAGES[type] }, true, true);
  }

  const classes = classNames(
    baseStageClasses,
    "mt-md leading-none",
    typeClasses[type]
  );

  return <div className={classes} onClick={onClick}>
    {name}: <b>{nts(count)}</b>
  </div>;
}
