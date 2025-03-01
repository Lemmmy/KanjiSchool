// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiSubject, ApiSubjectKanjiInner } from "@api";
import { hasReadings, onyomiToKatakana, useBooleanSetting } from "@utils";
import { useMemo } from "react";
import { PlainReadingsList } from "@pages/subject/readings/PlainReadingsList.tsx";

interface Props {
  subject: ApiSubject;
}

export function PlainPrimaryReadings({ subject }: Props): JSX.Element | null {
  const kanjiSubjectData = subject.data as ApiSubjectKanjiInner;
  const readings = hasReadings(subject) ? kanjiSubjectData.readings : undefined;

  // Get the primary readings and convert on'yomi to katakana if desired. For
  // vocabulary, get all readings, and highlight the primary ones.
  const onyomiInKatakana = useBooleanSetting("subjectOnyomiReadingsKatakana");
  const primaryReadings = readings
    ?.filter(r => (subject.object === "vocabulary" || r.primary) && r.type !== "nanori")
    .map(r => ({ ...r, reading: onyomiToKatakana(r, onyomiInKatakana) }));

  return useMemo(() => primaryReadings
    ? <PlainReadingsList readings={primaryReadings} className="iinline-block text-xxl" />
    : null, [primaryReadings]);
}
