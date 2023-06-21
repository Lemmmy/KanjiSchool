// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { countSessionItems } from "@session";

import { OnAnsweredFn, OnSkipFn } from "./SessionQuestionsPage";
import { SessionQuestionHeader } from "./SessionQuestionHeader";
import { SessionQuestionView } from "./SessionQuestionView";
import { SubjectInfo } from "@pages/subject/SubjectInfo";
import { DigraphAlert } from "./DigraphAlert";

import { StoredSubject } from "@api";
import { useBooleanSetting, useReducedMotion } from "@utils";

import { CSSTransition } from "react-transition-group";

interface Props {
  type: "meaning" | "reading";
  itemId: number;
  subject: StoredSubject;
  current: boolean;

  onIncorrectNext: () => void;
  onIncorrectUndo: () => void;
  onDontKnow: () => void;
  onAnswered: OnAnsweredFn;
  onSkip: OnSkipFn;
}


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
    classNames="session-page-inner-container"
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
    <div className="session-page-inner-container">
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

  const shouldShakeIncorrect = useBooleanSetting("shakeCharactersIncorrect");
  const classes = classNames("session-question-incorrect-container", {
    "should-shake-incorrect": shouldShakeIncorrect
  });

  return <div className={classes}>
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
