// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { FC, ReactNode } from "react";
import classNames from "classnames";

import { Link } from "react-router-dom";

import { StoredSubject, StoredAssignment, NormalizedSubjectType } from "@api";

import { SubjectCharacters } from "../../SubjectCharacters";

import { SrsStageShort } from "../../SrsStageShort";
import { SubjectRenderTooltipFn } from "../tooltip/SubjectTooltip";
import { getSrsStageBaseName, getSubjectUrl, normalizeVocabType, SrsStageBaseName } from "@utils";
import { useIsInStudyQueue } from "@session";
import { ItemsColorBy } from "@pages/items/types";
import { Size } from "@comp/subjects/lists/grid/style.ts";

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
  isVirtual?: boolean;
  colorBy?: ItemsColorBy;
  renderTooltip: SubjectRenderTooltipFn;
  children?: ReactNode;
}
export type SubjectGridItemProps = Props;

interface SizeClasses {
  base?: string;
  bg?: string;
  extra?: string;
  extraSrsFont?: string;
  subjectCharacters?: string;
  subjectCharactersFont?: string;
  subjectCharactersImageSize?: string;
  types?: Partial<Record<NormalizedSubjectType, string>>;
}

const sizeClasses: Record<Size, SizeClasses> = {
  normal: {
    base: "w-[80px] mr-sm mb-sm py-xs px-sm rounded leading-none",
    bg: "rounded bg-transparent hover:bg-white/10 light:hover:bg-black/5 transition-[background]",
    extra: "text-sm leading-[1.35]",
    subjectCharactersFont: "text-[56px] leading-[56px]",
    subjectCharactersImageSize: "w-[56px] h-[56px] text-[56px] m-0",
  },
  small: {
    base: "w-[68px] mr-[3px] mb-[3px] p-xss leading-none",
    bg: "rounded-sm bg-transparent hover:bg-white/10 light:hover:bg-black/5 transition-[background]",
    extra: "text-xs leading-[1.3]",
    extraSrsFont: "text-xss",
    // These should be the defaults
    // subjectCharactersFont: "text-[32px] leading-[32px]",
    // subjectCharactersImage: "w-[32px] h-[32px]",
  },
  tiny: {
    base: "w-[36px] h-[25px] p-0 m-px leading-[20px] rounded-sm",
    subjectCharactersFont: "text-[20px] leading-none",
    subjectCharactersImageSize: "w-[20px] h-[20px]",
    types: {
      vocabulary: "w-auto py-0"
    }
  },
};

const colorByTypeClasses: Record<NormalizedSubjectType, string> = {
  radical   : "bg-radical hover:bg-radical-lighter !text-radical-text",
  kanji     : "bg-kanji hover:bg-kanji-lighter !text-kanji-text",
  vocabulary: "bg-vocabulary hover:bg-vocabulary-lighter !text-vocabulary-text",
};

const colorBySrsStageClasses: Record<Lowercase<SrsStageBaseName>, string> = {
  lesson     : "bg-srs-lesson hover:bg-srs-lesson-lighter !text-black",
  apprentice : "bg-srs-apprentice hover:bg-srs-apprentice-lighter !text-black",
  guru       : "bg-srs-guru hover:bg-srs-guru-lighter !text-black",
  master     : "bg-srs-master hover:bg-srs-master-lighter !text-black",
  enlightened: "bg-srs-enlightened hover:bg-srs-enlightened-lighter !text-black",
  burned     : "bg-srs-burned hover:bg-srs-burned-lighter !text-black",
  locked     : "bg-srs-locked hover:bg-srs-locked-lighter light:opacity-35 !text-black",
};

function getBgColorClass(
  colorBy: ItemsColorBy,
  subject: StoredSubject,
  assignment: StoredAssignment | undefined
): string | undefined {
  if (colorBy === "type") {
    return colorByTypeClasses[normalizeVocabType(subject.object)];
  } else if (colorBy === "srs") {
    const stage = getSrsStageBaseName(assignment?.data.srs_stage ?? 10);
    return colorBySrsStageClasses[stage.toLowerCase() as Lowercase<SrsStageBaseName>];
  } else {
    return undefined;
  }
}

export const SubjectGridItem: FC<Props> = React.memo(function SubjectGridItem({
  subject,
  assignment,
  hideSrs,
  hideInQueue,
  size = "normal",
  className,
  colorBy,
  isVirtual,
  width,
  children
}): JSX.Element | null {
  const url = getSubjectUrl(subject);

  // Whether this subject is in the self-study queue
  const inQueue = useIsInStudyQueue(subject.id) && !hideInQueue;

  // Get the SRS stage if it is available
  const srsStage = hideSrs ? undefined : assignment?.data.srs_stage;
  const locked = !assignment?.data.unlocked_at;

  const sizeClassesObj = sizeClasses[size] ?? sizeClasses.normal;

  const bgClassName = size === "tiny" && colorBy
    ? getBgColorClass(colorBy, subject, assignment)
    : undefined;

  const normType = normalizeVocabType(subject.object);
  const classes = classNames(
    "subject-grid-item inline-block box-content text-center transition group text-basec",
    sizeClassesObj.base,
    sizeClassesObj.bg,
    sizeClassesObj.types?.[normType],
    bgClassName,
    className,
    {
      "opacity-65 light:opacity-40 hover:!opacity-100": locked,
      "ring-inset ring-2 ring-white/75 light:ring-primary/75": inQueue,
      "px-2": size === "tiny" && normType === "vocabulary" && !isVirtual
    }
  );

  return <Link
    to={url}
    style={width ? { width } : undefined}
    className={classes}
    data-sid={subject.id}
    data-aid={assignment?.id}
  >
    <SubjectCharacters
      subject={subject}
      textfit={false}
      className={classNames("align-middle text-center", sizeClassesObj.subjectCharacters)}
      fontClassName={sizeClassesObj.subjectCharactersFont}
      imageSizeClassName={sizeClassesObj.subjectCharactersImageSize}
      withColorClasses={size !== "tiny"}
    />

    {size !== "tiny" && <div
      className={classNames(
        "flex flex-col items-center mt-xs text-base-c/70 group-hover:text-white",
        "light:text-black light:group-hover:text-black",
        "transition",
        sizeClassesObj.extra
      )}
    >
      {children}

      {/* SRS stage, if available */}
      {srsStage !== undefined && <SrsStageShort
        assignment={assignment!}
        fontClassName={sizeClassesObj.extraSrsFont}
      />}
    </div>}
  </Link>;
});
