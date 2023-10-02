// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";

import { ApiSubjectKanjiInner, StoredSubject } from "@api";

import { SubjectCharacters } from "@comp/subjects/SubjectCharacters";
import { CommaList } from "@pages/subject/components/CommaList.tsx";

import { isVocabularyLike, normalizeVocabType, onyomiToKatakana, useBooleanSetting } from "@utils";
import { startCase } from "lodash-es";
import { SubjectTooltipLabel } from "@comp/subjects/lists/tooltip/SubjectTooltipLabel.tsx";

interface Props {
  subject: StoredSubject;
}

/** The tooltip subject data - characters, level, meaning and readings. */
export function SubjectTooltipSubjectData({ subject }: Props): JSX.Element {
  const objectType = subject.object;
  const { level, meanings } = subject.data;

  const isVocab = isVocabularyLike(subject);
  const isKanji = objectType === "kanji";

  const kanjiSubjectData = subject.data as ApiSubjectKanjiInner;
  const readings = objectType !== "radical" ? kanjiSubjectData.readings : undefined;

  const onyomiInKatakana = useBooleanSetting("subjectOnyomiReadingsKatakana");
  const onyomiReadings = useMemo(() => isKanji && readings
    ? readings
      .filter(r => r.type === "onyomi")
      .map(r => ({ ...r, reading: onyomiToKatakana(r, onyomiInKatakana) }))
    : undefined,
  [isKanji, readings, onyomiInKatakana]);

  const kunyomiReadings = useMemo(() => isKanji && readings
    ? readings.filter(r => r.type === "kunyomi") : undefined, [isKanji, readings]);

  return <>
    {/* Top part - subject characters, level and type */}
    <div className="flex flex-col items-center w-full text-center">
      <SubjectCharacters
        subject={subject}
        className="mb-xss"
        fontClassName="text-[40px] leading-[40px]"
        imageSizeClassName="w-[40px] h-[40px]"
      />

      <div className="text-desc mb-xs text-sm">
        Level {level} {startCase(normalizeVocabType(objectType))}
      </div>
    </div>

    {/* Meaning/reading info */}
    {/* Meaning */}
    <div>
      <SubjectTooltipLabel>Meaning:</SubjectTooltipLabel>
      <CommaList
        type="meaning"
        values={meanings.map(m => [m.meaning, m.primary])}
        className="inline"
      />
    </div>

    {/* Vocabulary readings */}
    {isVocab && readings?.length && <div>
      <SubjectTooltipLabel>Reading:</SubjectTooltipLabel>
      <CommaList
        type="reading"
        values={readings.map(r => [r.reading, r.primary])}
        className="inline"
      />
    </div>}

    {/* Kanji readings */}
    {/* On'yomi */}
    {isKanji && (onyomiReadings?.length || 0) > 0 && <div>
      <SubjectTooltipLabel>On&apos;yomi:</SubjectTooltipLabel>
      <CommaList
        type="reading"
        values={onyomiReadings!.map(r => [r.reading, r.primary])}
        className="inline"
      />
    </div>}

    {/* Kun'yomi */}
    {isKanji && (kunyomiReadings?.length || 0) > 0 && <div>
      <SubjectTooltipLabel>Kun&apos;yomi:</SubjectTooltipLabel>
      <CommaList
        type="reading"
        values={kunyomiReadings!.map(r => [r.reading, r.primary])}
        className="inline"
      />
    </div>}
  </>;
}
