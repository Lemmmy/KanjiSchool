// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiSubjectKanjiReading } from "@api";
import { CommaList } from "@pages/subject/components/CommaList.tsx";

interface Props {
  readings: ApiSubjectKanjiReading[];
  className?: string;
}

export function PlainReadingsList({ readings, className }: Props): JSX.Element {
  return <CommaList
    type="reading"
    values={readings
      // Hide the nanori readings for now
      ?.filter(r => (r as ApiSubjectKanjiReading).type !== "nanori")
      .map(r => [r.reading, r.primary])}
    className={className}
  />;
}
