// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";
import { Row } from "antd";

import { ApiSubject, useStudyMaterialBySubjectId } from "@api";

import { SessionQuestionHeader } from "./SessionQuestionHeader";
import { useSessionQuestionInput } from "./SessionQuestionInput";
import { OnAnsweredFn, OnSkipFn } from "./SessionQuestionsPage";

import { useStringSetting, NearMatchAction, normalizeVocabType } from "@utils";

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

  const classes = classNames(
    // Attempt to work around keyboard screen shifting on mobile
    "fixed inset-x-sm bottom-sm top-[68px] md:static", // sm + page-header = 68px
  );

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
    <Row>
      {inputEl}
    </Row>
  </div>;
}
