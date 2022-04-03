// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { useHistory } from "react-router-dom";

import { gotoSearch } from "@api";
import { nts, useBreakpoint } from "@utils";

interface LockedProps {
  level: number;
  count: number;
}

export function LockedSubjects({ level, count }: LockedProps): JSX.Element {
  // Hide the level on mobile for space
  const { sm } = useBreakpoint();

  const history = useHistory();

  function onClick() {
    gotoSearch(history, {
      minLevel: level,
      maxLevel: level,
      srsStages: [10],
      sortOrder: "SRS_THEN_TYPE"
    }, true, true);
  }

  const classes = classNames("srs-stage", "locked-subjects");

  return <div className={classes} onClick={onClick}>
    <span className="stage-name">Locked {sm && <>(lvl {level})</>}</span>
    <span className="stage-count">{nts(count)}</span>
  </div>;
}
