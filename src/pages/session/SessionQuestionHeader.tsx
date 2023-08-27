// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import classNames from "classnames";
import { Row, Col, Button, ButtonProps } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import { ApiSubject } from "@api";

import { OnSkipFn } from "./SessionQuestionsPage";
import { QuestionSrsStage } from "./QuestionSrsStage";
import { SubjectCharacters } from "@comp/subjects/SubjectCharacters";

import { startCase, kebabCase } from "lodash-es";
import { normalizeVocabType, nts, useBooleanSetting, useRandomFont, useStringSetting } from "@utils";
import { UndoButton } from "./UndoButton";
import { useSelector } from "react-redux";
import { RootState } from "@store";

/** High contrast/inverted color mode for the 'Reading/Meaning' type header */
export type QuestionHeaderTypeColor = "DEFAULT"
  | "DEFAULT_HIGH_CONTRAST"
  | "INVERTED"
  | "INVERTED_HIGH_CONTRAST";

interface Props {
  questionCount?: number;
  questionTotal?: number;
  wrappingUp?: boolean;
  subject: ApiSubject;
  incorrectAnswer?: string;
  type: "meaning" | "reading";
  onNext?: () => void;
  onUndo?: () => void;
  onDontKnow?: () => void;
  onSkip?: OnSkipFn;
}

export function SessionQuestionHeader({
  questionCount,
  questionTotal,
  wrappingUp,
  subject,
  incorrectAnswer,
  type: questionType,
  onNext,
  onUndo,
  onDontKnow,
  onSkip
}: Props): JSX.Element {
  // Make the buttons larger on mobile
  const { sm } = useBreakpoint();

  const objectType = normalizeVocabType(subject.object);

  // Props for all header buttons. Make the buttons larger on mobile.
  const buttonProps: ButtonProps = useMemo(() => ({
    size: sm ? undefined : "large"
  }), [sm]);

  // Whether to show the skip button
  const skipEnabled = useBooleanSetting("skipEnabled");

  const questionTypeHeaderColor = useStringSetting<QuestionHeaderTypeColor>("questionHeaderTypeColor");
  const questionTypeClasses = classNames(
    "session-question-type",
    "type-" + questionType,
    "color-" + kebabCase(questionTypeHeaderColor)
  );

  const { characters } = subject.data;
  const hasCharacter = characters !== null;

  const sessionUuid = useSelector((state: RootState) => state.session?.sessionState?.uuid);
  const randomFontEnabled = useBooleanSetting("randomFontEnabled");
  const randomFontHover = useBooleanSetting("randomFontHover");
  const randomFontShowName = useBooleanSetting("randomFontShowName");
  const randomFont = useRandomFont(hasCharacter ? characters : undefined, sessionUuid, questionType);
  const style = useMemo(() => ({ fontFamily: randomFont }), [randomFont]);

  const classes = classNames("session-question-header", "type-" + objectType, {
    ja: questionType === "reading",
    incorrect: incorrectAnswer !== undefined,
    "random-font-enabled": randomFontEnabled && randomFont && hasCharacter,
    "random-font-hover": randomFontHover
  });

  return <div className={classes}>
    {/* Subject top */}
    <Row className="session-top">
      {questionCount !== undefined && questionTotal !== undefined
        && (
          <span className="session-count">
            {wrappingUp && <span className="session-count-wrapping-up">
              Wrap-up:&nbsp;
            </span>}
            {nts(questionCount)}/{nts(questionTotal)}
          </span>
        )}

      {/* SRS stage */}
      <QuestionSrsStage subject={subject} />

      {/* Random font name */}
      {randomFontEnabled && randomFontShowName && randomFont && hasCharacter && (
        <span className="session-random-font-name">
          {randomFont}
        </span>
      )}
    </Row>

    {/* Subject question */}
    <Row className="session-question-main">
      <SubjectCharacters
        subject={subject}
        textfit
        min={32} max={sm ? 150 : 100}
        useCharBlocks
        style={style}
      />
    </Row>

    {/* Buttons */}
    <Row className="session-buttons">
      {/* Don't know/undo and skip */}
      <Col span={12} className="session-button-left-col">
        {incorrectAnswer !== undefined
          ? (
            // Undo. Only shown if enabled/disabled (i.e. not hidden)
            <UndoButton onUndo={onUndo} {...buttonProps} />
          )
          : (
            // Don't know
            <Button
              className="session-button-left session-button-dont-know"
              onClick={onDontKnow}
              {...buttonProps}
            >
              Don&apos;t know
            </Button>
          )}

        {/* Skip */}
        {skipEnabled && onSkip && <Button
          className="session-button-left session-button-skip"
          onClick={() => onSkip(false)}
          {...buttonProps}
        >
          Skip
        </Button>}
      </Col>

      {/* Submit */}
      <Col span={12}>
        <Button
          className="session-button-right session-button-submit"
          onClick={onNext}
          {...buttonProps}
        >
          Next
        </Button>
      </Col>
    </Row>

    {/* Question type */}
    <Row className={questionTypeClasses}>
      {objectType === "radical"
        ? "Radical Name"
        : (startCase(objectType) + " " + startCase(questionType))}
    </Row>

    {/* Incorrect answer */}
    {incorrectAnswer !== undefined && (
      <Row className="session-question-incorrect-answer">
        {incorrectAnswer || <>&nbsp;</>}
      </Row>
    )}
  </div>;
}
