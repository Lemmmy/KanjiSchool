// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { StoredAssignment } from "@api";

import { ShortDuration } from "@comp/ShortDuration";
import { stringifySrsStageShort } from "@utils";
import { isPast, parseISO } from "date-fns";

interface Props {
  assignment: StoredAssignment;
}

export function SrsStageShort({ assignment }: Props): JSX.Element {
  const { srs_stage, available_at } = assignment.data;
  const availableNow = available_at ? isPast(parseISO(available_at)) : false;

  const classes = classNames("txt", "srs", {
    "now": availableNow
  });

  return <span className={classes}>
    {stringifySrsStageShort(srs_stage)}
    {available_at && <>
      <span className="sep">-</span>
      {availableNow ? "Now" : <ShortDuration date={available_at} />}
    </>}
  </span>;
}
