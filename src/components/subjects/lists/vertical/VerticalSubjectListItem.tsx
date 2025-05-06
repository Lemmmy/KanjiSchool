// Copyright (c) 2021-2025 Drew Edwards
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

export const VerticalSubjectListItem = React.memo(function VerticalSubjectListItem({
  subject,
  assignment,
  extra,
  style,
  renderTooltip
}: Props): React.ReactElement | null {
  const url = getSubjectUrl(subject);

  // Whether this subject is in the self-study queue
  const inQueue = useIsInStudyQueue(subject.id);

  const boundRenderTooltip = useMemo(() =>
    renderTooltip.bind(renderTooltip, subject, assignment),
  [renderTooltip, subject, assignment]);

  const classes = classNames("!p-0", {
    "ring-inset ring-2 ring-white/75 light:ring-primary/75": inQueue,
  });

  return <Tooltip
    overlayClassName="subject-tooltip"
    title={boundRenderTooltip}
    destroyTooltipOnHide={true}
  >
    <List.Item className={classes} style={style}>
      <ConditionalLink
        to={url}
        matchTo
        className="flex-1 flex items-center justify-between py-xs px-md transition-all bg-transparent hover:bg-white/10"
      >
        <SubjectCharacters
          subject={subject}
          textfit={false}
          fontClassName="text-lg"
          imageSizeClassName="text-lg w-[16px]"
        />

        {extra && <div className="extra text-basec">{extra}</div>}
      </ConditionalLink>
    </List.Item>
  </Tooltip>;
});
