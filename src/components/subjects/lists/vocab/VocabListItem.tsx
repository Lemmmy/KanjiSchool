// Copyright (c) 2021-2025 Drew Edwards
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

import { getOneMeaning, getOneReading, getSubjectUrl, hasReadings } from "@utils";
import { useIsInStudyQueue } from "@session";
import { Size, vocabListSizeClasses } from "@comp/subjects/lists/vocab/sizes.ts";

interface Props {
  subject: ApiSubjectVocabulary;
  assignment?: StoredAssignment;
  hideReading?: boolean;
  size?: Size;
  divRef?: Ref<HTMLDivElement>;
  style?: CSSProperties;
  renderTooltip: SubjectRenderTooltipFn;
}

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

  // Whether this subject is in the self-study queue
  const inQueue = useIsInStudyQueue(subject.id);

  // Get the first available primary meaning and reading
  const meaning = getOneMeaning(subject);
  const reading = hasReadings(subject) ? getOneReading(subject) : null;

  // Get the SRS stage if it is available
  const srsStage = assignment?.data.srs_stage;
  const locked = !assignment?.data.unlocked_at;

  const sizeClasses = vocabListSizeClasses[size];

  const boundRenderTooltip = useMemo(() =>
    renderTooltip.bind(renderTooltip, subject, assignment),
  [renderTooltip, subject, assignment]);

  const classes = classNames(
    "block w-full box-border rounded leading-none bg-transparent hover:bg-white/10 light:hover:bg-black/10 group",
    "transition-[background-color,opacity]",
    sizeClasses.base,
    sizeClasses.height,
    {
      "opacity-65 light:opacity-40 hover:!opacity-100": locked,
      "ring-inset ring-2 ring-white/75 light:ring-primary/75": inQueue,
    }
  );

  const linkClasses = classNames(
    "flex flex-row items-center text-basec",
    sizeClasses.height
  );

  const textClasses = classNames(
    "line-clamp-1 text-ellipsis",
    sizeClasses.text
  );

  return <Tooltip
    overlayClassName="subject-tooltip"
    title={boundRenderTooltip}
    destroyTooltipOnHide={true}
  >
    <Row className={classes} ref={divRef} style={style}>
      <ConditionalLink to={url} matchTo className={linkClasses}>
        {/* Characters */}
        <div className="flex-1">
          <SubjectCharacters
            subject={subject}
            textfit={false}
            className="align-middle text-center"
            fontClassName={sizeClasses.charactersFontSize}
            imageSizeClassName={sizeClasses.charactersImageSize}
          />
        </div>

        <div className="flex flex-col items-end text-right transition-colors
          text-white/70 group-hover:!text-basec light:text-black/70">
          {/* Primary meaning */}
          <div className={textClasses}>{meaning}</div>

          {/* Primary reading */}
          {!hideReading && reading && <div className={classNames(textClasses, "font-ja !text-base")}>
            {reading}
          </div>}

          {/* SRS stage */}
          {srsStage !== undefined && <SrsStageShort
            assignment={assignment!}
            className={classNames(sizeClasses.srs, "text-desc")}
          />}
        </div>
      </ConditionalLink>
    </Row>
  </Tooltip>;
});
