// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { countSessionItems, QuestionType } from "@session";

import { OnAnsweredFn, OnSkipFn } from "./SessionQuestionsPage";
import { SessionQuestionHeader } from "./SessionQuestionHeader";
import { SessionQuestionView } from "./SessionQuestionView";
import { SubjectInfo } from "@pages/subject/SubjectInfo";
import { DigraphAlert } from "./DigraphAlert";

import { StoredSubject } from "@api";
import { useReducedMotion } from "@utils";

import { CSSTransition } from "react-transition-group";
import { CSSTransitionClassNames } from "react-transition-group/CSSTransition";

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

const cssTransitionBase = classNames(
  "select-none pointer-events-none fixed inset-0 md:static",
  "[&_.toc-affix]:opacity-0 [&_.toc-affix]:!transition-none"
);
const cssTransitionAnim = "transition-session-page duration-session-page ease-session-page";
const cssTransitionEnter = "scale-105 md:scale-110 opacity-0";
const cssTransitionEnterActive = "opacity-100 scale-100";
const cssTransitionExit = "!absolute !inset-lg";
const cssTransitionExitActive = "scale-95 md:scale-90 opacity-0";

const cssTransitionClasses: CSSTransitionClassNames = {
  appear: classNames(cssTransitionEnter),
  appearActive: classNames(cssTransitionBase, cssTransitionAnim, cssTransitionEnterActive),
  enter: classNames(cssTransitionEnter),
  enterActive: classNames(cssTransitionBase, cssTransitionAnim, cssTransitionEnterActive),
  exit: classNames(cssTransitionBase, cssTransitionExit, cssTransitionEnterActive),
  exitActive: classNames(cssTransitionBase, cssTransitionAnim, cssTransitionExit, cssTransitionExitActive),
};

const Wrapper = ({ shouldWrap, transitionKey, current, children }: {
  shouldWrap: boolean;
  transitionKey: string;
  current: boolean;
  children: JSX.Element;
}) => shouldWrap
  ? <CSSTransition
    key={transitionKey}
    in={current}
    appear
    timeout={300}
    classNames={cssTransitionClasses}
    unmountOnExit
  >
    {children}
  </CSSTransition>
  : (current ? children : null);

export function SessionQuestionContents(props: Props): JSX.Element {
  const { type, itemId, current } = props;

  const incorrectAnswer = useSelector((s: RootState) => s.session.incorrectAnswer);

  const reducedMotion = useReducedMotion();

  return <Wrapper
    shouldWrap={!reducedMotion}
    transitionKey={`${itemId}-${type}`}
    current={current}
  >
    <div>
      {incorrectAnswer !== undefined
        ? <IncorrectAnswerPart incorrectAnswer={incorrectAnswer} {...props} />
        : <SessionQuestionPart {...props} />}
    </div>
  </Wrapper>;
}

function IncorrectAnswerPart({
  type, subject, incorrectAnswer,
  onIncorrectNext, onIncorrectUndo, onSkip
}: Props & { incorrectAnswer: string }): JSX.Element {
  const digraphMatch = useSelector((s: RootState) => s.session.incorrectAnswerDigraphMatch, shallowEqual);

  const { finishedItems, totalItems, wrappingUp } = countSessionItems();

  const hasSingleCharacter = subject.data.characters === null || subject.data.characters?.length === 1;

  // Attempt to work around keyboard screen shifting on mobile
  return <div className="mt-0 md:-mt-xs">
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
