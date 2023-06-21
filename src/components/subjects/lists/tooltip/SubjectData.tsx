// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";

import { ApiSubjectKanjiInner, StoredSubject } from "@api";

import { SubjectCharacters } from "@comp/subjects/SubjectCharacters";
import { CommaList } from "@pages/subject/CommaList";

import { onyomiToKatakana, useBooleanSetting } from "@utils";
import { startCase } from "lodash-es";

interface Props {
  subject: StoredSubject;
}

/** The tooltip subject data - characters, level, meaning and readings. */
export function SubjectTooltipSubjectData({ subject }: Props): JSX.Element {
  const objectType = subject.object;
  const { level, meanings } = subject.data;

  const isVocab = objectType === "vocabulary";
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
    <div className="subject-tooltip-top">
      <SubjectCharacters subject={subject} />

      <div className="subject-tooltip-level">
        Level {level} {startCase(objectType)}
      </div>
    </div>

    {/* Meaning/reading info */}
    {/* Meaning */}
    <div className="row meaning-row">
      <span className="label">Meaning:</span>
      <CommaList
        type="meaning"
        values={meanings.map(m => [m.meaning, m.primary])}
      />
    </div>

    {/* Vocabulary readings */}
    {isVocab && readings?.length && <div className="row reading-row">
      <span className="label">Reading:</span>
      <CommaList
        type="reading"
        values={readings.map(r => [r.reading, r.primary])}
      />
    </div>}

    {/* Kanji readings */}
    {/* On'yomi */}
    {isKanji && (onyomiReadings?.length || 0) > 0 && <div className="row reading-row">
      <span className="label">On&apos;yomi:</span>
      <CommaList
        type="reading"
        values={onyomiReadings!.map(r => [r.reading, r.primary])}
      />
    </div>}

    {/* Kun'yomi */}
    {isKanji && (kunyomiReadings?.length || 0) > 0 && <div className="row reading-row">
      <span className="label">Kun&apos;yomi:</span>
      <CommaList
        type="reading"
        values={kunyomiReadings!.map(r => [r.reading, r.primary])}
      />
    </div>}
  </>;
}
