// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import { useNavigate } from "react-router-dom";

import { gotoSearch } from "@api";
import { nts } from "@utils";
import { baseStageClasses } from "@pages/dashboard/srs-stages/SrsStagesCard.tsx";

interface LockedProps {
  level: number;
  count: number;
}

export const lockedSquareTextClasses = classNames(
  "text-white light:text-black",
  "light:palette-fdd:text-white",
  "palette-fdl:text-white light:palette-fdl:text-black"
);

const lockedSquareClasses = classNames(
  baseStageClasses,
  lockedSquareTextClasses,
  "bg-srs-locked"
);

export function LockedSubjects({ level, count }: LockedProps): JSX.Element {
  // Hide the level on mobile for space
  const { sm } = useBreakpoint();

  const navigate = useNavigate();

  function onClick() {
    gotoSearch(navigate, {
      minLevel: level,
      maxLevel: level,
      srsStages: [10],
      sortOrder: "SRS_THEN_TYPE"
    }, true, true);
  }

  return <div className={lockedSquareClasses} onClick={onClick}>
    <div>Locked {sm && <>(lvl {level})</>}</div>
    <div className="text-4xl">{nts(count)}</div>
  </div>;
}
