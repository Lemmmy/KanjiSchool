// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { StoredAssignment } from "@api";

import { ShortDuration } from "@comp/ShortDuration";
import { stringifySrsStageShort } from "@utils";
import dayjs from "dayjs";

interface Props {
  assignment: StoredAssignment;
  className?: string;
  fontClassName?: string;
}

export function SrsStageShort({
  assignment,
  className,
  fontClassName = "text-sm"
}: Props): React.ReactElement {
  const { srs_stage, available_at } = assignment.data;
  const availableNow = available_at ? dayjs(available_at).isBefore(dayjs()) : false;

  const classes = classNames(
    "line-clamp-2 text-ellipsis leading-[1.35]",
    className,
    fontClassName,
    {
      "text-green light:text-green-5 light:font-bold": availableNow,
      "text-desc": !availableNow
    }
  );

  return <span className={classes}>
    {stringifySrsStageShort(srs_stage)}
    {available_at && <>
      <span className="inline-block mx-text">-</span>
      {availableNow ? "Now" : <ShortDuration date={available_at} />}
    </>}
  </span>;
}
