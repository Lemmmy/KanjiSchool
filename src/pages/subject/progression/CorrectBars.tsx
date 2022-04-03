// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { StoredSubject, useReviewStatisticBySubjectId } from "@api";

import { CorrectBar } from "./CorrectBar";

interface Props {
  subject: StoredSubject;
}

export function CorrectBars({ subject }: Props): JSX.Element | null {
  const type = subject.object;
  const hasReading = type !== "radical";

  const reviewStatistic = useReviewStatisticBySubjectId(subject.id);
  if (!reviewStatistic) return null;
  const { data } = reviewStatistic;

  return <>
    {/* Combined answered correctly, for non-radicals. No streak counters */}
    {hasReading && <CorrectBar
      name="Combined answered correctly"
      correct={data.meaning_correct + data.reading_correct}
      incorrect={data.meaning_incorrect + data.reading_incorrect}
    />}

    {/* Meaning answered correctly */}
    <CorrectBar
      name={(hasReading ? "Meaning" : "Name") + " answered correctly"}
      correct={data.meaning_correct} incorrect={data.meaning_incorrect}
      maxStreak={data.meaning_max_streak}
      currentStreak={data.meaning_current_streak}
    />

    {/* Reading answered correctly */}
    {hasReading && <CorrectBar
      name="Reading answered correctly"
      correct={data.reading_correct} incorrect={data.reading_incorrect}
      maxStreak={data.reading_max_streak}
      currentStreak={data.reading_current_streak}
    />}
  </>;
}
