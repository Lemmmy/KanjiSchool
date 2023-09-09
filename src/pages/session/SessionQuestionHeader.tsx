// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import classNames from "classnames";
import { Row, Col, Button, ButtonProps } from "antd";

import { ApiSubject } from "@api";

import { OnSkipFn } from "./SessionQuestionsPage";
import { QuestionSrsStage } from "./QuestionSrsStage";
import { SubjectCharacters } from "@comp/subjects/SubjectCharacters";

import { startCase } from "lodash-es";
import { normalizeVocabType, nts, useBooleanSetting, useRandomFont, useStringSetting } from "@utils";
import { UndoButton } from "./UndoButton";
import { useSelector } from "react-redux";
import { RootState } from "@store";
import { QuestionType } from "@session";
import { useSingleBreakpoint } from "@utils/hooks/useSingleBreakpoint.ts";

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
  type: QuestionType;
  onNext?: () => void;
  onUndo?: () => void;
  onDontKnow?: () => void;
  onSkip?: OnSkipFn;
}

const questionTypeBaseClass = "block w-full p-xss my-sm rounded text-center text-lg font-bold";

const questionTypeColorClass: Record<QuestionHeaderTypeColor, Record<QuestionType, string>> = {
  DEFAULT: {
    meaning: "light:bg-question-meaning-light light:text-basec bg-question-meaning-dark text-white",
    reading: "light:bg-question-reading-light light:text-white bg-black text-desc",
  },
  DEFAULT_HIGH_CONTRAST: {
    meaning: "light:bg-question-meaning-light-hc light:text-black bg-question-meaning-dark-hc text-black",
    reading: "light:bg-question-reading-light-hc light:text-white bg-black text-white",
  },
  INVERTED: {
    meaning: "light:bg-question-reading-light light:text-white bg-black text-desc",
    reading: "light:bg-question-meaning-light light:text-basec bg-question-meaning-dark text-white",
  },
  INVERTED_HIGH_CONTRAST: {
    meaning: "light:bg-question-reading-light-hc light:text-white bg-black text-white",
    reading: "light:bg-question-meaning-light-hc light:text-black bg-question-meaning-dark-hc text-black",
  },
};

const incorrectAnswerClass = classNames(
  questionTypeBaseClass,
  "-mt-sm mb-md bg-red-8 light:bg-red-5 text-white rounded-t-none !text-xxl !font-normal"
);

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
  const md = useSingleBreakpoint("md");

  const objectType = normalizeVocabType(subject.object);

  // Props for all header buttons. Make the buttons larger on mobile.
  const buttonProps: ButtonProps = useMemo(() => ({
    size: !md ? "large" : undefined
  }), [md]);

  // Whether to show the skip button
  const skipEnabled = useBooleanSetting("skipEnabled");

  const questionTypeHeaderColor = useStringSetting<QuestionHeaderTypeColor>("questionHeaderTypeColor");
  const questionTypeClasses = classNames(
    questionTypeBaseClass,
    questionTypeColorClass[questionTypeHeaderColor][questionType],
    {
      "rounded-b-none": incorrectAnswer !== undefined
    }
  );

  const { characters } = subject.data;
  const hasCharacter = characters !== null;

  const sessionUuid = useSelector((state: RootState) => state.session?.sessionState?.uuid);
  const shouldShakeIncorrect = useBooleanSetting("shakeCharactersIncorrect");
  const randomFontEnabled = useBooleanSetting("randomFontEnabled");
  const randomFontHover = useBooleanSetting("randomFontHover");
  const randomFontShowName = useBooleanSetting("randomFontShowName");
  const randomFont = useRandomFont(hasCharacter ? characters : undefined, sessionUuid, questionType);
  const style = useMemo(() => ({ fontFamily: randomFont }), [randomFont]);

  const charactersClasses = classNames(
    // Hack for text fitting
    "w-full max-w-[768px] block text-center leading-none",
    {
      "hover:!font-ja": randomFontEnabled && randomFontHover && randomFont && hasCharacter,
      "animate-shake transform-[translateX(0)]": incorrectAnswer !== undefined && shouldShakeIncorrect,
    }
  );

  return <div>
    {/* Subject top */}
    <Row className="text-desc relative h-[1rem] mb-md">
      {questionCount !== undefined && questionTotal !== undefined
        && (
          <span className="absolute w-full">
            {wrappingUp && <span className="opacity-90 italic">
              Wrap-up:&nbsp;
            </span>}
            {nts(questionCount)}/{nts(questionTotal)}
          </span>
        )}

      {/* SRS stage */}
      <QuestionSrsStage subject={subject} />

      {/* Random font name */}
      {randomFontEnabled && randomFontShowName && randomFont && hasCharacter && (
        <span className="absolute right-0 w-[30%] text-sm text-right whitespace-nowrap overflow-hidden text-ellipsis">
          {randomFont}
        </span>
      )}
    </Row>

    {/* Subject question */}
    <Row className="mb-sm md:mb-md">
      <SubjectCharacters
        subject={subject}
        textfit
        min={32}
        max={md ? 150 : 100}
        useCharBlocks

        className={charactersClasses}
        fontClassName="text-[100px] md:text-[150px]" // Hack for text fitting
        imageClassName="mx-auto"

        style={style}
      />
    </Row>

    {/* Buttons */}
    <Row>
      {/* Don't know/undo and skip */}
      <Col span={12} className="flex gap-sm">
        {incorrectAnswer !== undefined
          ? (
            // Undo. Only shown if enabled/disabled (i.e. not hidden)
            <UndoButton onUndo={onUndo} {...buttonProps} />
          )
          : (
            // Don't know
            <Button onClick={onDontKnow} {...buttonProps}>
              Don&apos;t know
            </Button>
          )}

        {/* Skip */}
        {skipEnabled && onSkip && <Button
          onClick={() => onSkip(false)}
          {...buttonProps}
        >
          Skip
        </Button>}
      </Col>

      {/* Submit */}
      <Col span={12}>
        <Button onClick={onNext} className="float-right" {...buttonProps}>
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

    {/* In  correct answer */}
    {incorrectAnswer !== undefined && (
      <Row className={incorrectAnswerClass}>
        {incorrectAnswer || <>&nbsp;</>}
      </Row>
    )}
  </div>;
}
