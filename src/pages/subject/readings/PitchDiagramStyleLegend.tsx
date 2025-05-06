// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiSubjectVocabulary } from "@api";
import { getPitchInfosForSubject, RawVocabAccentData } from "@utils/pitchAccent.ts";

import { PitchDiagramOnkaiShikiAccents } from "./PitchDiagramOnkaiShikiAccents.tsx";
import { PitchDiagramSenShikiAccents } from "./PitchDiagramSenShikiAccents.tsx";
import { ReactNode } from "react";

const dummyReading = "へいばん";
const dummyChars = "平板";

const dummyDatabase: RawVocabAccentData = {
  [`${dummyChars}-${dummyReading}`]: [0]
};

const dummySubject: ApiSubjectVocabulary = {
  id: -1,
  object: "vocabulary",
  url: "",
  data_updated_at: "",
  data: {
    characters: dummyChars,
    readings: [{
      reading: dummyReading,
      primary: true,
      accepted_answer: true,
    }],

    auxiliary_meanings: [],
    created_at: "",
    document_url: "",
    hidden_at: "",
    lesson_position: 0,
    level: 0,
    meaning_mnemonic: "",
    meanings: [],
    slug: "",
    spaced_repetition_system_id: 0,

    component_subject_ids: [],
    context_sentences: [],
    parts_of_speech: [],
    pronunciation_audios: [],
    reading_mnemonic: "",
  }
};
const dummySubjectReading = dummySubject.data.readings[0];

const dummyData = getPitchInfosForSubject(dummyDatabase, dummySubject)!;
const dummyPitchInfo = dummyData[0].pitchInfos[0];

interface Props {
  label: ReactNode;
  diagram: ReactNode;
}

function PitchDiagramStyleLegend({ label, diagram }: Props): React.ReactElement {
  return <div className="flex items-center gap-xs whitespace-nowrap">
    <span className="whitespace-nowrap flex-1">
      {label}
    </span>

    <span className="!font-normal scale-75 h-[24px] -mt-[12px] -mx-[12px]">
      {diagram}
    </span>
  </div>;
}

export const PitchDiagramOnkaiShikiLegend = (): React.ReactElement => <PitchDiagramStyleLegend
  label="音階式 (scale style, default)"
  diagram={<PitchDiagramOnkaiShikiAccents reading={dummySubjectReading} pitchInfo={dummyPitchInfo} />}
/>;

export const PitchDiagramSenShikiLegend = (): React.ReactElement => <PitchDiagramStyleLegend
  label="線式 (line style)"
  diagram={<PitchDiagramSenShikiAccents reading={dummySubjectReading} pitchInfo={dummyPitchInfo} />}
/>;

