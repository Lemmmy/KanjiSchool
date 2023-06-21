// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { CSSProperties, Ref, useMemo } from "react";
import { Row, Tooltip } from "antd";
import classNames from "classnames";

import { ApiSubjectVocabulary, StoredAssignment } from "@api";

import { SubjectCharacters } from "../../SubjectCharacters";
import { ConditionalLink } from "@comp/ConditionalLink";
import { SrsStageShort } from "../../SrsStageShort";
import { SubjectRenderTooltipFn } from "../tooltip/SubjectTooltip";

import { getOneMeaning, getOneReading, getSubjectUrl } from "@utils";
import { useIsInStudyQueue } from "@session";

// "tiny" is unsupported
export type Size = "tiny" | "small" | "normal";

interface Props {
  subject: ApiSubjectVocabulary;
  assignment?: StoredAssignment;
  hideReading?: boolean;
  size?: Size;
  divRef?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  renderTooltip: SubjectRenderTooltipFn;
}

const keepParentFalse = { keepParent: false };

export const VocabListItem = React.memo(function VocabListItem({
  subject,
  assignment,
  size = "normal",
  hideReading,
  divRef,
  style,
  renderTooltip
}: Props): JSX.Element | null {
  const url = getSubjectUrl(subject);

  // Whether or not this subject is in the self-study queue
  const inQueue = useIsInStudyQueue(subject.id);

  // Get the first available primary meaning and reading
  const meaning = getOneMeaning(subject);
  const reading = getOneReading(subject);

  // Get the SRS stage if it is available
  const srsStage = assignment?.data.srs_stage;
  const locked = !assignment?.data.unlocked_at;

  const boundRenderTooltip = useMemo(() =>
    renderTooltip.bind(renderTooltip, subject, assignment),
  [renderTooltip, subject, assignment]);

  const classes = classNames(
    "vocab-list-item",
    "size-" + size,
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
    <Row className={classes} ref={divRef} style={style}>
      <ConditionalLink to={url} matchTo>
        {/* Characters */}
        <div className="left-col">
          <SubjectCharacters subject={subject} textfit={false} />
        </div>

        <div className="right-col">
          {/* Primary meaning */}
          <div className="txt meaning vocab-meaning">{meaning}</div>

          {/* Primary reading */}
          {!hideReading && <div className="txt reading vocab-reading ja">
            {reading}
          </div>}

          {/* SRS stage */}
          {srsStage !== undefined && <SrsStageShort assignment={assignment!} />}
        </div>
      </ConditionalLink>
    </Row>
  </Tooltip>;
});
