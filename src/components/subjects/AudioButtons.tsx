// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import { Space } from "antd";

import { ApiSubjectPronunciationAudio, ApiSubjectVocabulary } from "@api";

import { AudioButton } from "./AudioButton";

import { getPrimaryReading } from "@utils";
import { asc, map as mapCmp } from "@utils/comparator";

import { OptimalStringAlignment } from "string-metric/dist/OptimalStringAlignment";
const osa = new OptimalStringAlignment();

interface Props {
  subject: ApiSubjectVocabulary;
  autoPlay?: boolean;
}

export function AudioButtons({
  subject,
  autoPlay
}: Props): JSX.Element | null {
  const pronunciations = useMemo(() => {
    if (subject.object !== "vocabulary" || !subject.data.pronunciation_audios.length)
      return [];

    // Get the primary reading and pronunciations for this subject.
    const primaryReading = getPrimaryReading(subject);
    const pronunciations = Object.keys(subject.data.pronunciation_audios.reduce((acc, a) => {
      const p = a.metadata.pronunciation;
      acc[p] ??= [];
      acc[p].push(a);
      return acc;
    }, {} as Record<string, ApiSubjectPronunciationAudio[]>));

    // Sort by distance such that the primary reading comes first
    if (primaryReading) {
      pronunciations.sort(mapCmp(p => osa.distance(p, primaryReading), asc));
    }

    return pronunciations;
  }, [subject]);

  if (subject.object !== "vocabulary" || !pronunciations || !pronunciations.length)
    return null;

  return <Space
    direction="vertical"
    align="end"
    className="subject-audio-buttons"
  >
    {pronunciations.map((p, i) => <AudioButton
      key={p}
      subject={subject}
      pronunciation={p}
      autoPlay={i === 0 && autoPlay}
      hasShortcut={i === 0} // Give the first audio button keyboard shortcuts
    />)}
  </Space>;
}
