// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect, useCallback, ReactNode } from "react";
import { Card } from "antd";

import {
  useSubjects, useReviewStatistics,
  StoredSubjectMap, ApiReviewStatisticMap, NormalizedSubjectType
} from "@api";

import { normalizeVocabType, nts, useBooleanSetting } from "@utils";
import { CardTable, CardTableCell, CardTableRow } from "@pages/dashboard/CardTable.tsx";
import classNames from "classnames";

interface Column {
  total: number;
  correct: number;
  incorrect: number;
  accuracyPercent?: ReactNode;

  radical?:    ReactNode;
  kanji?:      ReactNode;
  vocabulary?: ReactNode;
}

interface Data {
  meaning: Column;
  reading: Column;
  total:   Column;
}

const headersReadingFirst = ["", "Reading", "Meaning", "Total"];
const headersMeaningFirst = ["", "Meaning", "Reading", "Total"];

const typeClasses: Record<NormalizedSubjectType, string> = {
  radical:    "!text-radical",
  kanji:      "!text-kanji",
  vocabulary: "!text-vocabulary"
};

function num(n: number | undefined): JSX.Element | null {
  if (n === undefined || isNaN(n)) return null;
  return <>{nts(n)}</>;
}

function perc(n: number, total: number): JSX.Element | null {
  if (total === 0) return null;
  return <>{((n / total) * 100).toFixed(2)}%</>;
}

function colVal(val: ReactNode | number): ReactNode | null {
  if (typeof val === "number") return num(val);
  return val ?? null;
}

function getData(
  subjects?: StoredSubjectMap,
  reviewStatistics?: ApiReviewStatisticMap
): Data | undefined {
  if (!subjects || !reviewStatistics) return undefined;

  const counts = {
    tm: 0, tr: 0, t: 0, // Total meanings, readings, reviews
    cm: 0, cr: 0, c: 0, // Correct meanings, readings, reviews
    im: 0, ir: 0, i: 0, // Incorrect meanings, readings, reviews
    r: { cm: 0, im: 0, cr: 0, ir: 0 }, // Radical correct/incorrect meanings/readings
    k: { cm: 0, im: 0, cr: 0, ir: 0 }, // Kanji
    v: { cm: 0, im: 0, cr: 0, ir: 0 }, // Vocabulary
  };

  // Find all review statistics and their subjects (to check for hidden)
  for (const reviewStatisticId in reviewStatistics) {
    const { data } = reviewStatistics[reviewStatisticId];
    // Discard invalid or hidden subjects
    const subject = subjects[data.subject_id];
    if (!subject || subject.data.hidden_at) continue;

    // Get the first char of the subject type
    const normObjectType = normalizeVocabType(data.subject_type);
    const type = normObjectType.charAt(0) as "r" | "k" | "v";

    // Get the correct/incorrect meanings/readings
    const cm = data.meaning_correct;
    const im = data.meaning_incorrect;
    const cr = type === "r" ? 0 : data.reading_correct;
    const ir = type === "r" ? 0 : data.reading_incorrect;

    // Add to all the counts
    counts.tm += cm + im; // Total meanings
    counts.tr += cr + ir; // Total readings
    counts.t += cm + im + cr + ir; // Total reviews

    counts.cm += cm; // Correct meanings
    counts.cr += cr; // Correct readings
    counts.c += cm + cr; // Correct reviews

    counts.im += im; // Incorrect meanings
    counts.ir += ir; // Incorrect readings
    counts.i += im + ir; // Incorrect reviews

    counts[type].cm += cm; // Correct meanings (for this type)
    counts[type].cr += cr; // Correct readings (for this type)
    counts[type].im += im; // Incorrect meanings (for this type)
    counts[type].ir += ir; // Incorrect readings (for this type)
  }

  return {
    meaning: {
      total: counts.tm, correct: counts.cm, incorrect: counts.im,
      accuracyPercent: perc(counts.cm, counts.tm),
      radical:         perc(counts.r.cm, counts.r.cm + counts.r.im),
      kanji:           perc(counts.k.cm, counts.k.cm + counts.k.im),
      vocabulary:      perc(counts.v.cm, counts.v.cm + counts.v.im)
    },
    reading: {
      total: counts.tr, correct: counts.cr, incorrect: counts.ir,
      accuracyPercent: perc(counts.cr, counts.tr),
      kanji:           perc(counts.k.cr, counts.k.cr + counts.k.ir),
      vocabulary:      perc(counts.v.cr, counts.v.cr + counts.v.ir)
    },
    total: {
      total: counts.tm + counts.tr,
      correct: counts.cm + counts.cr,
      incorrect: counts.im + counts.ir,
      accuracyPercent: perc(counts.cm + counts.cr, counts.tm + counts.tr),
      radical:         perc(counts.r.cm + counts.r.cr, counts.r.cm + counts.r.cr + counts.r.im + counts.r.ir),
      kanji:           perc(counts.k.cm + counts.k.cr, counts.k.cm + counts.k.cr + counts.k.im + counts.k.ir),
      vocabulary:      perc(counts.v.cm + counts.v.cr, counts.v.cm + counts.v.cr + counts.v.im + counts.v.ir)
    }
  };
}

export function ReviewAccuracyCard(): JSX.Element {
  const [data, setData] = useState<Data>();

  const subjects = useSubjects();
  const reviewStatistics = useReviewStatistics();

  useEffect(() => setData(getData(subjects, reviewStatistics)),
    [subjects, reviewStatistics]);

  const readingFirst = useBooleanSetting("dashboardAccuracyReadingFirst");

  const col1 = data ? (readingFirst ? data.reading : data.meaning) : undefined;
  const col2 = data ? (readingFirst ? data.meaning : data.reading) : undefined;
  const col3 = data ? data.total : undefined;

  const row = useCallback((
    key: keyof Column,
    label: string,
    className?: string
  ): JSX.Element => {
    const cellClass = classNames(typeClasses[key as NormalizedSubjectType], className);

    return <CardTableRow className={className}>
      <CardTableCell>{label}</CardTableCell>
      <CardTableCell className={cellClass}>{colVal(col1?.[key])}</CardTableCell>
      <CardTableCell className={cellClass}>{colVal(col2?.[key])}</CardTableCell>
      <CardTableCell className={cellClass}>{colVal(col3?.[key])}</CardTableCell>
    </CardTableRow>;
  }, [col1, col2, col3]);

  return <Card
    title="Review accuracy"
    className="h-auto [&>.ant-card-body]:p-0 [&>.ant-card-body]:overflow-hidden"
    loading={!data}
  >
    <CardTable headers={readingFirst ? headersReadingFirst : headersMeaningFirst}>
      {row("total", "Total reviews")}
      {row("correct", "Correct")}
      {row("incorrect", "Incorrect")}
      {row("accuracyPercent", "Accuracy")}
      {row("radical", "Radicals", "bg-black/8")}
      {row("kanji", "Kanji", "bg-black/8")}
      {row("vocabulary", "Vocabulary", "bg-black/8")}
    </CardTable>
  </Card>;
}
