// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { StoredAssignment } from "@api";

import { stringifySrsStage } from "@utils";
import { isPast, parseISO } from "date-fns";
import dayjs from "dayjs";

interface Props {
  assignment?: StoredAssignment;
}

/** The tooltip assignment info - SRS stage and next review */
export function SubjectTooltipAssignmentData({
  assignment
}: Props): JSX.Element {
  const srsStage = assignment?.data.srs_stage ?? 10;
  const nextReview = assignment?.data.available_at;
  const availableNow = nextReview ? isPast(parseISO(nextReview)) : false;

  return <>
    {/* SRS stage */}
    <div className="row srs-stage-row">
      <span className="label">SRS stage:</span>
      {stringifySrsStage(srsStage)}
    </div>

    {/* Next review */}
    {nextReview && <div className="row next-review-row">
      <span className="label">Next review:</span>
      <span className={availableNow ? "available-now" : undefined}>
        {dayjs(nextReview).format("llll")}
      </span>
    </div>}
  </>;
}
