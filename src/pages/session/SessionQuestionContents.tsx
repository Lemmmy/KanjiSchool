// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import { countSessionItems, QuestionType } from "@session";

import { OnAnsweredFn, OnSkipFn } from "./SessionQuestionsPage";
import { SessionQuestionHeader } from "./SessionQuestionHeader";
import { SessionQuestionView } from "./SessionQuestionView";
import { SubjectInfo } from "@pages/subject/SubjectInfo";
import { DigraphAlert } from "./DigraphAlert";
import { SessionPageTransition } from "@pages/session/SessionPageTransition.tsx";

import { StoredSubject } from "@api";
import { useReducedMotion } from "@utils";

interface Props {
  type: QuestionType;
  itemId: number;
  subject: StoredSubject;
  current: boolean;

  onIncorrectNext: () => void;
  onIncorrectUndo: () => void;
  onDontKnow: () => void;
  onAnswered: OnAnsweredFn;
  onSkip: OnSkipFn;
}

export function SessionQuestionContents(props: Props): JSX.Element {
  const { type, itemId, current } = props;

  const incorrectAnswer = useAppSelector(s => s.session.incorrectAnswer);

  const reducedMotion = useReducedMotion();

  return <SessionPageTransition
    shouldWrap={!reducedMotion}
    transitionKey={`${itemId}-${type}`}
    current={current}
  >
    <div>
      {incorrectAnswer !== undefined
        ? <IncorrectAnswerPart incorrectAnswer={incorrectAnswer} {...props} />
        : <SessionQuestionPart {...props} />}
    </div>
  </SessionPageTransition>;
}

function IncorrectAnswerPart({
  type, subject, incorrectAnswer,
  onIncorrectNext, onIncorrectUndo, onSkip
}: Props & { incorrectAnswer: string }): JSX.Element {
  const digraphMatch = useAppSelector(s => s.session.incorrectAnswerDigraphMatch, shallowEqual);

  const { finishedItems, totalItems, wrappingUp } = countSessionItems();

  const hasSingleCharacter = subject.data.characters === null || subject.data.characters?.length === 1;

  // Attempt to work around keyboard screen shifting on mobile
  return <div className="-mt-xs md:mt-0">
    <SessionQuestionHeader
      questionCount={finishedItems}
      questionTotal={totalItems}
      wrappingUp={wrappingUp}

      subject={subject}
      type={type}
      onNext={onIncorrectNext}
      onUndo={onIncorrectUndo}
      onSkip={onSkip}

      incorrectAnswer={incorrectAnswer}
    />
    {/* Show the digraph hint if the incorrect answer was a digraph match. */}
    {digraphMatch && <DigraphAlert digraphMatch={digraphMatch} />}
    <SubjectInfo
      subject={subject}
      useHintStage
      questionType={type}
      charactersMax={48}

      // Shrink a multi-character vocabulary's text
      subjectCharactersClass={!hasSingleCharacter ? "m-0" : undefined}
      subjectCharactersFontClass={!hasSingleCharacter ? "text-[32px]" : undefined}
      subjectCharactersImageClass={!hasSingleCharacter ? "w-[32px] h-[32px]" : undefined}
    />
  </div>;
}

function SessionQuestionPart({
  type, subject, current,
  onDontKnow, onAnswered, onSkip
}: Props): JSX.Element {
  const { finishedItems, totalItems, wrappingUp } = countSessionItems();

  return <SessionQuestionView
    isCurrent={current}
    questionCount={finishedItems}
    questionTotal={totalItems}
    wrappingUp={wrappingUp}

    subject={subject}
    type={type}
    onAnswered={onAnswered}
    onDontKnow={onDontKnow}
    onSkip={onSkip}
  />;
}
