// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { lazy, Suspense, useMemo } from "react";
import classNames from "classnames";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

import { ApiSubject, ApiSubjectVocabulary } from "@api";

import { CommaList } from "./components/CommaList.tsx";
import { SubjectHintStage } from "./hintStages";
import { HintStageButtons } from "./HintStageButtons";
import { PlainPrimaryReadings } from "./readings/PlainPrimaryReadings.tsx";
import { PlainKanjiReadings } from "./readings/PlainKanjiReadings.tsx";
import { SubjectCharacters } from "@comp/subjects/SubjectCharacters";
import { AudioButtons } from "@comp/subjects/AudioButtons";

import { isVocabularyLike, normalizeVocabType, useBooleanSetting } from "@utils";
import { StudyQueueButton } from "@comp/study-queue/StudyQueueButton.tsx";

const PitchAccentDiagrams = lazy(() => import("./readings/PitchAccentDiagrams.tsx"));

interface Props {
  subject: ApiSubject;
  hasCharacter?: boolean;
  hasSingleCharacter?: boolean;
  charactersMax?: number;

  showQueueButton?: boolean;
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

export function SubjectInfoTopRow(props: Props): JSX.Element {
  const {
    subject, hasSingleCharacter, charactersMax,
    showQueueButton, hintStage, onNextHintStage,
    hideMeanings, hideReadings, hideAudio, autoPlayAudio,
    subjectCharactersClass, subjectCharactersFontClass, subjectCharactersImageClass,
  } = props;

  const objectType = subject.object;
  const normObjectType = normalizeVocabType(subject.object);
  const { level, meanings } = subject.data;

  // Used for the audio buttons
  const isVocab = isVocabularyLike(subject);

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
        <div className="flex gap-sm">
          {/* Characters */}
          <div className="flex-0">
            <SubjectCharacters
              subject={subject}
              className="leading-none"
              fontClassName="text-[72px] m-lg"
              imageSizeClassName="w-[72px] h-[72px] mx-lg"
            />
          </div>

          {/* Level, name, reading */}
          <div className="flex-1">
            {/* Level & object type */}
            <div className="text-sm text-desc">
              Level {level} {normObjectType}
            </div>
            {/* Meanings */}
            {!hideMeanings && meaningsComp}

            {/* Readings. For kanji, only show the on'yomi readings. Pitch accent data will be lazily loaded for
              * vocabulary if it is enabled, and will internally fall back to the plain readings if there is no pitch
              * accent data available for the subject. */}
            {!hideReadings && (
              pitchAccentEnabled && isVocab
                ? <Suspense><PitchAccentDiagrams subject={subject} /></Suspense>
                : <PlainPrimaryReadings subject={subject} />
            )}
          </div>

          <CommonButtons
            subject={subject}
            showQueueButton={showQueueButton}
            autoPlayAudio={autoPlayAudio}
            hintStage={hintStage}
            onNextHintStage={onNextHintStage}
            hideAudio={hideAudio}
          />
        </div>

        {/* On'yomi and kun'yomi readings */}
        {!hideReadings && objectType === "kanji" && <PlainKanjiReadings subject={subject} />}
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
        <div className="flex gap-sm">
          <div className="flex-1">
            {/* Meanings */}
            {!hideMeanings && meaningsComp}

            {/* Readings. Pitch accent data will be lazily loaded for vocabulary if it is enabled, and will internally
              * fall back to the plain readings if there is no pitch accent data available for the subject. */}
            {!hideReadings && (
              pitchAccentEnabled && isVocab
                ? <Suspense><PitchAccentDiagrams subject={subject} /></Suspense>
                : <PlainPrimaryReadings subject={subject} />
            )}
          </div>

          <CommonButtons
            subject={subject}
            showQueueButton={showQueueButton}
            autoPlayAudio={autoPlayAudio}
            hintStage={hintStage}
            onNextHintStage={onNextHintStage}
            hideAudio={hideAudio}
          />
        </div>
      </div>
    );
}

type CommonButtonsProps = Pick<Props, "subject" | "showQueueButton" | "autoPlayAudio" | "hintStage" |
  "onNextHintStage" | "hideAudio">;

function CommonButtons({
  subject,
  showQueueButton,
  autoPlayAudio,
  hintStage,
  onNextHintStage,
  hideAudio
}: CommonButtonsProps) {
  const { sm } = useBreakpoint();

  const isVocab = isVocabularyLike(subject);
  const vocabSubject = subject as ApiSubjectVocabulary;

  return <>
    <div className="flex flex-col gap-sm">
      {/* Queue button */}
      {showQueueButton && <StudyQueueButton
        subjectId={subject.id}
        useShortTitle={!sm}
      />}

      {/* Audio buttons */}
      {!hideAudio && isVocab && <AudioButtons
        subject={vocabSubject}
        autoPlay={autoPlayAudio}
      />}
    </div>

    {/* Show more/Show all hint stage buttons */}
    <HintStageButtons
      hintStage={hintStage}
      onNextHintStage={onNextHintStage}
    />
  </>;
}
