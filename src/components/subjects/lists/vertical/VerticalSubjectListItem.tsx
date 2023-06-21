// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { CSSProperties, ReactNode, useMemo } from "react";
import { List, Tooltip } from "antd";
import classNames from "classnames";

import { StoredSubject, StoredAssignment } from "@api";

import { SubjectCharacters } from "../../SubjectCharacters";
import { ConditionalLink } from "@comp/ConditionalLink";
import { getSubjectUrl } from "@utils";
import { useIsInStudyQueue } from "@session";
import { SubjectRenderTooltipFn } from "../tooltip/SubjectTooltip";

interface Props {
  subject: StoredSubject;
  assignment?: StoredAssignment;
  extra?: ReactNode;
  style?: CSSProperties;
  renderTooltip: SubjectRenderTooltipFn;
}

const keepParentFalse = { keepParent: false };

export const VerticalSubjectListItem = React.memo(function VerticalSubjectListItem({
  subject,
  assignment,
  extra,
  style,
  renderTooltip
}: Props): JSX.Element | null {
  const url = getSubjectUrl(subject);

  // Whether or not this subject is in the self-study queue
  const inQueue = useIsInStudyQueue(subject.id);

  const boundRenderTooltip = useMemo(() =>
    renderTooltip.bind(renderTooltip, subject, assignment),
  [renderTooltip, subject, assignment]);

  const classes = classNames("vertical-subject-list-item", {
    "in-queue": inQueue
  });

  return <Tooltip
    overlayClassName="subject-tooltip"
    title={boundRenderTooltip}
    destroyTooltipOnHide={keepParentFalse}
  >
    <List.Item className={classes} style={style}>
      <ConditionalLink to={url} matchTo>
        <SubjectCharacters subject={subject} textfit={false} />
        {extra && <div className="extra">{extra}</div>}
      </ConditionalLink>
    </List.Item>
  </Tooltip>;
});
