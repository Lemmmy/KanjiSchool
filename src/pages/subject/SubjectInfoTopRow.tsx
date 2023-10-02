// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { lazy, Suspense, useMemo } from "react";
import { Row, Col } from "antd";
import classNames from "classnames";

import { ApiSubject, ApiSubjectVocabulary } from "@api";

import { CommaList } from "./components/CommaList.tsx";
import { SubjectHintStage } from "./hintStages";
import { HintStageButtons } from "./HintStageButtons";
import { PlainPrimaryReadings } from "./readings/PlainPrimaryReadings.tsx";
import { PlainKanjiReadings } from "./readings/PlainKanjiReadings.tsx";
import { SubjectCharacters } from "@comp/subjects/SubjectCharacters";
import { AudioButtons } from "@comp/subjects/AudioButtons";

import { isVocabularyLike, normalizeVocabType, useBooleanSetting } from "@utils";

const PitchAccentDiagrams = lazy(() => import("./readings/PitchAccentDiagrams.tsx"));

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

  // Get the CommaList components for all the meanings and readings lists
  const meaningsComp = useMemo(() => <CommaList
    type="meaning"
    values={meanings.map(m => [m.meaning, m.primary])}
    className="text-[21.6px]"
  />, [meanings]);

  const pitchAccentEnabled = useBooleanSetting("pitchAccentEnabled");

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
            {!hideReadings && <PlainPrimaryReadings subject={subject} />}
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
        {!hideReadings && objectType === "kanji" && <PlainKanjiReadings subject={subject} />}

        {/* Pitch accent diagrams, lazily loaded if enabled */}
        {pitchAccentEnabled && isVocab && <Suspense>
          <PitchAccentDiagrams subject={subject} />
        </Suspense>}
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
            {!hideReadings && <PlainPrimaryReadings subject={subject} />}
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

        {/* Pitch accent diagrams, lazily loaded if enabled */}
        {pitchAccentEnabled && isVocab && <Suspense>
          <PitchAccentDiagrams subject={subject} />
        </Suspense>}
      </div>
    );
}
