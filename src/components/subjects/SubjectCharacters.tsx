// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { useMemo } from "react";
import classNames from "classnames";

import { ApiSubject, ApiSubjectRadicalInner, NormalizedSubjectType } from "@api";

import { Textfit } from "react-textfit";
import { CharacterImage } from "./CharacterImage";

import { getJpCharBlocks, normalizeVocabType, renderCharBlocks, useBooleanSetting } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:subject-characters");

interface Props {
  subject: ApiSubject;

  textfit?: boolean;
  min?: number;
  max?: number;

  useCharBlocks?: boolean;

  className?: string;
  fontClassName?: string;
  imageClassName?: string;
  imageSizeClassName?: string;
  style?: React.CSSProperties;
}

const colorClasses: Record<NormalizedSubjectType, string> = {
  radical   : "text-radical",
  kanji     : "text-kanji",
  vocabulary: "text-vocabulary"
};

export const SubjectCharacters = React.memo(({
  subject,
  textfit,
  min,
  max,
  useCharBlocks,
  className,
  fontClassName = "text-[32px]",
  imageClassName,
  imageSizeClassName,
  style
}: Props): JSX.Element | null => {
  const objectType = subject.object;
  const normObjectType = normalizeVocabType(objectType);
  const { characters } = subject.data;

  // Some radicals have images instead of UTF-8 characters. Use the SVGs.
  const hasCharacter = characters !== null;
  const characterImages = objectType === "radical" && !hasCharacter
    ? (subject.data as ApiSubjectRadicalInner).character_images : undefined;

  const charBlocksEnabled = useBooleanSetting("subjectCharactersUseCharBlocks");
  const charBlocks = useMemo(() => charBlocksEnabled && useCharBlocks
    && characters && normObjectType === "vocabulary"
    ? renderCharBlocks(getJpCharBlocks(characters))
    : undefined,
  [charBlocksEnabled, useCharBlocks, characters, normObjectType]);

  // If the subject is hidden, don't render anything
  if (subject.data.hidden_at) {
    debug("WARNING! rendering hidden %s %d (%s) %o", subject.object, subject.id, subject.data.characters, subject);
    return null;
  }

  const classes = classNames(
    "font-ja",
    colorClasses[normObjectType],
    fontClassName,
    className,
    {
      "subject-characters-textfit": textfit,
      "subject-characters-with-char-blocks": !!charBlocks
    }
  );

  if (characterImages) {
    // Character image for radicals
    return <CharacterImage
      className={classNames(classes, imageClassName)}
      sizeClassName={imageSizeClassName}
      subjectId={subject.id}
      size={max}
    />;
  } else if (textfit) {
    // Text fit for large subject views
    return <div className={classes} style={style}>
      <Textfit
        mode="single"
        forceSingleModeWidth
        min={min}
        max={max}
      >
        {charBlocks ?? characters ?? ""}
      </Textfit>
    </div>;
  } else {
    // Regular text for everything else
    return <span className={classes} style={style}>
      {charBlocks ?? characters}
    </span>;
  }
});
