// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { useMemo } from "react";
import { Row, Col } from "antd";
import classNames from "classnames";

import { NormalizedSubjectType, StoredSubjectMap, useSubjects } from "@api";
import { SessionResults } from "@session";

import { normalizeVocabType, nts } from "@utils";

interface Props {
  results: SessionResults;
}

const typeBackgroundClasses: Record<NormalizedSubjectType, string> = {
  "radical": "bg-radical",
  "kanji": "bg-kanji",
  "vocabulary": "bg-vocabulary"
};

const colClasses = "flex flex-col justify-center items-center text-center rounded mx-xss p-md first:ml-0 last:mr-0";

function num(n: number | undefined): React.ReactElement | null {
  if (n === undefined || isNaN(n)) return null;
  return <>{nts(n)}</>;
}

function perc(n: number, total: number): React.ReactElement | null {
  if (total === 0) return <>100</>;
  return <>{((n / total) * 100).toFixed(0)}</>;
}

interface Data {
  correct: { radical: number; kanji: number; vocabulary: number };
  total: { radical: number; kanji: number; vocabulary: number };
}

function analyzeData(
  subjects: StoredSubjectMap | undefined,
  correct: number[],
  incorrect: number[]
): Data | undefined {
  if (!subjects) return;

  // Correct and total for each subject type
  const data: Data = {
    correct: { radical: 0, kanji: 0, vocabulary: 0 },
    total: { radical: 0, kanji: 0, vocabulary: 0 }
  };

  // Increment the correct + totals for correct subjects
  for (const correctId of correct) {
    const type = normalizeVocabType(subjects[correctId].object);
    data.correct[type]++;
    data.total[type]++;
  }

  // Increment just the totals for incorrect subjects
  for (const incorrectId of incorrect) {
    const type = normalizeVocabType(subjects[incorrectId].object);
    data.total[type]++;
  }

  return data;
}

export const Summary = React.memo(({ results }: Props): React.ReactElement | null => {
  const subjects = useSubjects();

  const { correctSubjectIds: correct, incorrectSubjectIds: incorrect } = results;
  const total = correct.length + incorrect.length;

  // Calculate the amount of correct vs incorrect subjects for each subject type
  const data = useMemo(() =>
    analyzeData(subjects, correct, incorrect), [subjects, correct, incorrect]);

  if (!subjects || !data) return null;

  return <Row>
    {/* Percentage correct */}
    <Col flex="1" className={classNames(colClasses, "mr-sm relative bg-srs-locked light:bg-[#d9d9d9]")}>
      {/* Arrow */}
      <div className="absolute -right-[32px] z-20 border-0 border-solid border-y-[24px] border-y-transparent
        border-l-[32px] border-l-srs-locked light:border-l-[#d9d9d9]" />

      <div>
        <span className="font-medium text-[36px]">{perc(correct.length, total)}</span>
        <span className="text-desc text-[24px]">%</span>
      </div>
      <div className="text-desc">Answered correctly</div>
    </Col>

    {/* Radicals/kanji/vocabulary correct */}
    <CorrectEl type="radical" data={data} />
    <CorrectEl type="kanji" data={data} />
    <CorrectEl type="vocabulary" data={data} />
  </Row>;
});

const SUBJECT_TYPE_LABELS = {
  "radical": "Radicals",
  "kanji": "Kanji",
  "vocabulary": "Vocabulary"
};

function CorrectEl({
  type, data
}: {
  type: NormalizedSubjectType;
  data: Data;
}): React.ReactElement | null {
  const correct = data.correct[type];
  const total = data.total[type];

  if (total === 0) return null;

  const classes = classNames(
    colClasses,
    "text-black",
    typeBackgroundClasses[type]
  );

  return <Col flex="1" className={classes}>
    <div>
      <span className="font-medium text-[36px]">{num(correct)}</span>
      <span className="text-[24px]">&nbsp;/&nbsp;{num(total)}</span>
    </div>
    <div className="text-black">{SUBJECT_TYPE_LABELS[type]}</div>
  </Col>;
}
