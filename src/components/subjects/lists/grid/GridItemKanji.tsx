// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectGridItem, SubjectGridItemProps } from "./SubjectGridItem";
import { getOneMeaning, getOneReading, hasReadings, useBooleanSetting } from "@utils";

export function GridItemKanji({
  subject,
  hideMeaning,
  hideReading,
  ...rest
}: SubjectGridItemProps): JSX.Element | null {
  if (subject.object !== "kanji")
    throw new Error("Using GridItemKanji for subject type " + subject.object);

  // First available primary meaning
  const meaning = getOneMeaning(subject);

  // Get the first available primary reading, and convert it to katakana if it
  // is on'yomi and the user desires it
  const onyomiInKatakana = useBooleanSetting("subjectOnyomiReadingsKatakana");
  const reading = hasReadings(subject) ? getOneReading(subject, onyomiInKatakana) : null;

  return <SubjectGridItem
    subject={subject}
    {...rest}
  >
    {/* Primary meaning */}
    {!hideMeaning && <span className="text-xs leading-[1.3]">
      {meaning}
    </span>}

    {/* Primary reading */}
    {!hideReading && reading && <span className="text-xs leading-[1.3] font-ja text-base">
      {reading}
    </span>}
  </SubjectGridItem>;
}
