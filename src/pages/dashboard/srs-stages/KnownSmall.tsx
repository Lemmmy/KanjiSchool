// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { useNavigate } from "react-router-dom";

import { gotoSearch } from "@api";
import { nts } from "@utils";

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

export function KnownSmall({
  type, name, count
}: KnownSmallProps): JSX.Element {
  const navigate = useNavigate();

  function onClick() {
    gotoSearch(navigate, { srsStages: KNOWN_SMALL_STAGES[type] }, true, true);
  }

  const classes = classNames(
    "srs-stage",
    "known-subjects",
    "known-small",
    "type-" + type
  );

  return <div className={classes} onClick={onClick}>
    <span className="stage-name">{name}</span>
    <span className="stage-count">{nts(count)}</span>
  </div>;
}
