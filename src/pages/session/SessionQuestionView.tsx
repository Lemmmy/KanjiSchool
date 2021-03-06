// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";
import { Row } from "antd";

import { ApiSubject, useStudyMaterialBySubjectId } from "@api";

import { SessionQuestionHeader } from "./SessionQuestionHeader";
import { useSessionQuestionInput } from "./SessionQuestionInput";
import { OnAnsweredFn, OnSkipFn } from "./SessionQuestionsPage";

import { useStringSetting, NearMatchAction } from "@utils";

interface Props {
  isCurrent: boolean;
  questionCount?: number;
  questionTotal?: number;
  wrappingUp?: boolean;
  subject: ApiSubject;
  type: "meaning" | "reading";
  onAnswered: OnAnsweredFn;
  onDontKnow: () => void;
  onSkip: OnSkipFn;
}

export function SessionQuestionView({
  isCurrent,
  questionCount,
  questionTotal,
  wrappingUp,
  subject,
  type: questionType,
  onAnswered,
  onDontKnow,
  onSkip
}: Props): JSX.Element {
  const objectType = subject.object;

  const nearMatchAction = useStringSetting<NearMatchAction>("nearMatchAction");

  // To get the meaning synonyms, if available
  const studyMaterial = useStudyMaterialBySubjectId(subject.id);
  const meaningSynonyms = studyMaterial?.data.meaning_synonyms;

  const [inputEl, onSubmit] = useSessionQuestionInput(
    isCurrent, questionType,
    subject,
    meaningSynonyms,
    nearMatchAction,
    onAnswered,
    onSkip
  );

  const classes = classNames("session-question-container", "type-" + objectType, {
    ja: questionType === "reading"
  });

  return <div className={classes}>
    <SessionQuestionHeader
      questionTotal={questionTotal}
      questionCount={questionCount}
      wrappingUp={wrappingUp}

      subject={subject}
      type={questionType}
      onNext={onSubmit}
      onDontKnow={onDontKnow}
      onSkip={onSkip}
    />

    {/* Question input */}
    <Row className="session-question-input">
      {inputEl}
    </Row>
  </div>;
}
