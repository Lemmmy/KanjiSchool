// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiSubject, ApiSubjectKanjiInner } from "@api";
import { onyomiToKatakana, useBooleanSetting } from "@utils";
import { useMemo } from "react";
import { PlainReadingsList } from "@pages/subject/readings/PlainReadingsList.tsx";

interface Props {
  subject: ApiSubject;
}

export function PlainKanjiReadings({ subject }: Props): React.ReactElement | null {
  const { readings } = subject.data as ApiSubjectKanjiInner;

  // For kanji subjects, separate the readings into on'yomi and kun'yomi.
  const onyomiInKatakana = useBooleanSetting("subjectOnyomiReadingsKatakana");
  const onyomiReadings = useMemo(() => readings!
    .filter(r => r.type === "onyomi")
    .map(r => ({ ...r, reading: onyomiToKatakana(r, onyomiInKatakana) })),
  [readings, onyomiInKatakana]);

  const kunyomiReadings = useMemo(() => readings!.filter(r => r.type === "kunyomi"), [readings]);

  const onyomiReadingsComp = useMemo(() =>
    <PlainReadingsList readings={onyomiReadings} className="inline-block" />, [onyomiReadings]);
  const kunyomiReadingsComp = useMemo(() =>
    <PlainReadingsList readings={kunyomiReadings} className="inline-block" />, [kunyomiReadings]);

  if (!onyomiReadings.length && !kunyomiReadings.length) return null;

  return <div className="mt-md">
    {/* On'yomi */}
    {onyomiReadings?.length ? (
      <div className="readings-onyomi">
        <span className="inline-block mr-xss font-bold">
          On&apos;yomi:
        </span>
        {onyomiReadingsComp}
      </div>
    ) : null }

    {/* Kun'yomi */}
    {kunyomiReadings?.length ? (
      <div className="readings-kunyomi">
        <span className="inline-block mr-xss font-bold">
          Kun&apos;yomi:
        </span>
        {kunyomiReadingsComp}
      </div>
    ) : null}
  </div>;
}
