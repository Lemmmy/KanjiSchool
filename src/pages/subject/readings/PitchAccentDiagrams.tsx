// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiSubject } from "@api";

import vocabAccentData from "@data/vocab-accent.json";
import { getPitchInfosForSubject, RawVocabAccentData } from "@utils/pitchAccent.ts";
import { useMemo } from "react";

interface Props {
  subject: ApiSubject;
}

const database = vocabAccentData as unknown as RawVocabAccentData;

export default function PitchAccentDiagrams({ subject }: Props): JSX.Element | null {
  const data = useMemo(() => getPitchInfosForSubject(database, subject), [subject]);
  return <div>{JSON.stringify(data)}</div>;
}
