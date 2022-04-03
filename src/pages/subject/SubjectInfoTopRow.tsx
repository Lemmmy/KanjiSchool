// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import { Row, Col } from "antd";

import { ApiSubject, ApiSubjectKanjiInner, ApiSubjectKanjiReading, ApiSubjectVocabulary } from "@api";

import { CommaList } from "./CommaList";
import { HintStageButtons } from "./HintStageButtons";
import { SubjectCharacters } from "@comp/subjects/SubjectCharacters";
import { AudioButtons } from "@comp/subjects/AudioButtons";

import { onyomiToKatakana, useBooleanSetting } from "@utils";

interface Props {
  subject: ApiSubject;
  hasCharacter?: boolean;
  hasSingleCharacter?: boolean;
  charactersMax?: number;

  hintStage?: 0 | 1 | 2 | undefined;
  onNextHintStage?: () => void;

  hideMeanings?: boolean;
  hideReadings?: boolean;
  hideAudio?: boolean;

  autoPlayAudio?: boolean;
}

function getReadingsComp(
  readings: ApiSubjectKanjiReading[] | undefined,
  type: "meaning" | "reading" | string = "reading"
): JSX.Element {
  return <CommaList
    type={type}
    values={readings
      // Hide the nanori readings for now
      ?.filter(r => (r as ApiSubjectKanjiReading).type !== "nanori")
      .map(r => [r.reading, r.primary])}
  />;
}

export function SubjectInfoTopRow({
  subject,
  hasSingleCharacter,
  charactersMax,

  hintStage,
  onNextHintStage,

  hideMeanings,
  hideReadings,
  hideAudio,

  autoPlayAudio
}: Props): JSX.Element {
  const objectType = subject.object;
  const { level, meanings } = subject.data;

  // Used for the audio buttons
  const isVocab = objectType === "vocabulary";
  const vocabSubject = subject as ApiSubjectVocabulary;

  // Get the readings if this is a kanji/vocabulary subject
  const isKanji = objectType === "kanji";
  const kanjiSubjectData = subject.data as ApiSubjectKanjiInner;
  const readings = objectType !== "radical" ? kanjiSubjectData.readings : undefined;

  // For kanji subjects, separate the readings into on'yomi and kun'yomi.
  const onyomiInKatakana = useBooleanSetting("subjectOnyomiReadingsKatakana");
  const onyomiReadings = useMemo(() => isKanji
    ? readings!
      .filter(r => r.type === "onyomi")
      .map(r => ({ ...r, reading: onyomiToKatakana(r, onyomiInKatakana) }))
    : undefined,
  [isKanji, readings, onyomiInKatakana]);

  const kunyomiReadings = useMemo(() => isKanji
    ? readings!.filter(r => r.type === "kunyomi") : undefined, [isKanji, readings]);

  // Get the CommaList components for all the meanings and readings lists
  const meaningsComp = useMemo(() => <CommaList
    type="meaning"
    values={meanings.map(m => [m.meaning, m.primary])}
  />, [meanings]);

  // Get the primary readings and convert on'yomi to katakana if desired. For
  // vocabulary, get all readings, and highlight the primary ones.
  const primaryReadings = readings
    ?.filter(r => (objectType === "vocabulary" || r.primary) && r.type !== "nanori")
    .map(r => ({ ...r, reading: onyomiToKatakana(r, onyomiInKatakana) }));
  const primaryReadingsComp = useMemo(() => getReadingsComp(primaryReadings), [primaryReadings]);

  const onyomiReadingsComp = useMemo(() =>
    getReadingsComp(onyomiReadings, "reading-sub"), [onyomiReadings]);
  const kunyomiReadingsComp = useMemo(() =>
    getReadingsComp(kunyomiReadings, "reading-sub"), [kunyomiReadings]);

  return hasSingleCharacter
    ? (
      // Single character
      <div className="subject-info-top">
        <Row className="subject-info-top-upper">
          {/* Characters */}
          <Col flex="none">
            <SubjectCharacters subject={subject} />
          </Col>

          {/* Level, name, reading */}
          <Col flex="auto">
            {/* Level & object type */}
            <div className="subject-info-level">Level {level} {objectType}</div>
            {/* Meanings */}
            {!hideMeanings && meaningsComp}
            {/* Readings. For kanji, only show the on'yomi readings. */}
            {!hideReadings && primaryReadingsComp}
          </Col>

          {/* Audio buttons */}
          {!hideAudio && isVocab && <AudioButtons
            subject={vocabSubject}
            autoPlay={autoPlayAudio}
          />}

          {/* Show more/Show all hint stage buttons */}
          <HintStageButtons
            hintStage={hintStage}
            onNextHintStage={onNextHintStage}
          />
        </Row>

        {/* On'yomi and kun'yomi readings */}
        {!hideReadings && (onyomiReadings?.length || kunyomiReadings?.length) ? (
          <div className="subject-info-top-lower">
            {/* On'yomi */}
            {onyomiReadings?.length ? (
              <div className="readings-sub readings-onyomi">
                <span className="readings-label">On&apos;yomi:</span>
                {onyomiReadingsComp}
              </div>
            ) : null }

            {/* Kun'yomi */}
            {kunyomiReadings?.length ? (
              <div className="readings-sub readings-kunyomi">
                <span className="readings-label">Kun&apos;yomi:</span>
                {kunyomiReadingsComp}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    )
    : (
      // Multiple characters
      <div className="subject-info-top">
        {/* Level & object type */}
        <div className="subject-info-level">Level {level} {objectType}</div>

        {/* Characters */}
        <SubjectCharacters
          subject={subject}
          textfit
          min={32} max={charactersMax || 96}
          useCharBlocks
        />

        {/* Meanings, readings, buttons */}
        <Row className="subject-info-top-lower">
          <Col flex="auto">
            {/* Meanings */}
            {!hideMeanings && meaningsComp}
            {/* Readings */}
            {!hideReadings && primaryReadingsComp}
          </Col>

          {/* Audio buttons */}
          {!hideAudio && isVocab && <AudioButtons
            subject={vocabSubject}
            autoPlay={autoPlayAudio}
          />}

          {/* Show more/Show all hint stage buttons */}
          <HintStageButtons
            hintStage={hintStage}
            onNextHintStage={onNextHintStage}
          />
        </Row>
      </div>
    );
}
