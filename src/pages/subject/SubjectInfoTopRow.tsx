// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import { Row, Col } from "antd";

import { ApiSubject, ApiSubjectKanjiInner, ApiSubjectKanjiReading, ApiSubjectVocabulary } from "@api";

import { CommaList } from "./CommaList";
import { SubjectHintStage } from "./hintStages";
import { HintStageButtons } from "./HintStageButtons";
import { SubjectCharacters } from "@comp/subjects/SubjectCharacters";
import { AudioButtons } from "@comp/subjects/AudioButtons";

import { hasReadings, isVocabularyLike, normalizeVocabType, onyomiToKatakana, useBooleanSetting } from "@utils";
import classNames from "classnames";

interface Props {
  subject: ApiSubject;
  hasCharacter?: boolean;
  hasSingleCharacter?: boolean;
  charactersMax?: number;

  hintStage?: SubjectHintStage | undefined;
  onNextHintStage?: () => void;

  hideMeanings?: boolean;
  hideReadings?: boolean;
  hideAudio?: boolean;

  autoPlayAudio?: boolean;

  subjectCharactersClass?: string;
  subjectCharactersFontClass?: string;
  subjectCharactersImageClass?: string;
}

function getReadingsComp(
  readings: ApiSubjectKanjiReading[] | undefined,
  className?: string,
): JSX.Element {
  return <CommaList
    type="reading"
    values={readings
      // Hide the nanori readings for now
      ?.filter(r => (r as ApiSubjectKanjiReading).type !== "nanori")
      .map(r => [r.reading, r.primary])}
    className={className}
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

  autoPlayAudio,

  subjectCharactersClass,
  subjectCharactersFontClass,
  subjectCharactersImageClass,
}: Props): JSX.Element {
  const objectType = subject.object;
  const normObjectType = normalizeVocabType(subject.object);
  const { level, meanings } = subject.data;

  // Used for the audio buttons
  const isVocab = isVocabularyLike(subject);
  const vocabSubject = subject as ApiSubjectVocabulary;

  // Get the readings if this is a kanji/vocabulary subject
  const isKanji = objectType === "kanji";
  const kanjiSubjectData = subject.data as ApiSubjectKanjiInner;
  const readings = hasReadings(subject) ? kanjiSubjectData.readings : undefined;

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
    className="text-[21.6px]"
  />, [meanings]);

  // Get the primary readings and convert on'yomi to katakana if desired. For
  // vocabulary, get all readings, and highlight the primary ones.
  const primaryReadings = readings
    ?.filter(r => (objectType === "vocabulary" || r.primary) && r.type !== "nanori")
    .map(r => ({ ...r, reading: onyomiToKatakana(r, onyomiInKatakana) }));
  const primaryReadingsComp = useMemo(() =>
    getReadingsComp(primaryReadings, "inline-block text-xxl"), [primaryReadings]);

  const onyomiReadingsComp = useMemo(() =>
    getReadingsComp(onyomiReadings, "inline-block"), [onyomiReadings]);
  const kunyomiReadingsComp = useMemo(() =>
    getReadingsComp(kunyomiReadings, "inline-block"), [kunyomiReadings]);

  return hasSingleCharacter
    ? (
      // Single character
      <div className="subject-info-top">
        <Row>
          {/* Characters */}
          <Col flex="none">
            <SubjectCharacters
              subject={subject}
              className="leading-none"
              fontClassName="text-[72px] m-lg"
              imageSizeClassName="w-[72px] h-[72px] mx-lg"
            />
          </Col>

          {/* Level, name, reading */}
          <Col flex="auto">
            {/* Level & object type */}
            <div className="text-sm text-desc">
              Level {level} {normObjectType}
            </div>
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
          <div className="mt-md">
            {/* On'yomi */}
            {onyomiReadings?.length ? (
              <div className="readings-onyomi">
                <span className="inline-block mr-xss font-bold">
                  On&apos;yomi:
                </span>
                {onyomiReadingsComp}
              </div>
            ) : null }

            {/* Kun'yomi */}
            {kunyomiReadings?.length ? (
              <div className="readings-kunyomi">
                <span className="inline-block mr-xss font-bold">
                  Kun&apos;yomi:
                </span>
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
        <div className="text-sm text-desc">
          Level {level} {normObjectType}
        </div>

        {/* Characters */}
        <SubjectCharacters
          subject={subject}
          textfit
          min={32} max={charactersMax || 96}
          useCharBlocks

          className={classNames(subjectCharactersClass, "w-full max-w-[768px] text-[96px] my-md leading-none")}
          fontClassName={subjectCharactersFontClass}
          imageSizeClassName={subjectCharactersImageClass}
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
