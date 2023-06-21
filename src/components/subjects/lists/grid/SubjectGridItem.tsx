// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { FC, useMemo } from "react";
import { Tooltip } from "antd";
import classNames from "classnames";

import { Link } from "react-router-dom";

import { StoredSubject, StoredAssignment } from "@api";

import { SubjectCharacters } from "../../SubjectCharacters";

import { Size } from "./";
import { SrsStageShort } from "../../SrsStageShort";
import { SubjectRenderTooltipFn } from "../tooltip/SubjectTooltip";
import { getSrsStageBaseName, getSubjectUrl } from "@utils";
import { useIsInStudyQueue } from "@session";

interface Props {
  subject: StoredSubject;
  assignment?: StoredAssignment;
  hideMeaning?: boolean;
  hideReading?: boolean;
  hideSrs?: boolean;
  hideInQueue?: boolean;
  size?: Size;
  width?: number;
  className?: string;
  renderTooltip: SubjectRenderTooltipFn;
}
export type SubjectGridItemProps = Props;

const keepParentFalse = { keepParent: false };

export const SubjectGridItem: FC<Props> = React.memo(function SubjectGridItem({
  subject,
  assignment,
  className,
  hideSrs,
  hideInQueue,
  size = "normal",
  width,
  renderTooltip,
  children
}): JSX.Element | null {
  const url = getSubjectUrl(subject);

  // Whether or not this subject is in the self-study queue
  const inQueue = useIsInStudyQueue(subject.id) && !hideInQueue;

  // Get the SRS stage if it is available
  const srsStage = hideSrs ? undefined : assignment?.data.srs_stage;
  const locked = !assignment?.data.unlocked_at;

  const boundRenderTooltip = useMemo(() =>
    renderTooltip.bind(renderTooltip, subject, assignment),
  [renderTooltip, subject, assignment]);

  const classes = classNames(
    "subject-grid-item",
    "size-" + size,
    "type-" + subject.object,
    "srs-" + getSrsStageBaseName(srsStage ?? 10).toLowerCase(),
    className,
    {
      locked,
      "in-queue": inQueue
    }
  );

  return <Tooltip
    overlayClassName="subject-tooltip"
    title={boundRenderTooltip}
    destroyTooltipOnHide={keepParentFalse}
  >
    <Link
      to={url}
      style={width ? { width } : undefined}
      className={classes}
    >
      <SubjectCharacters subject={subject} textfit={false} />

      {size !== "tiny" && <div className="extra">
        {children}

        {/* SRS stage, if available */}
        {srsStage !== undefined && <SrsStageShort assignment={assignment!} />}
      </div>}
    </Link>
  </Tooltip>;
});
