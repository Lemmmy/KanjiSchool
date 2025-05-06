// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";

import { ApiSubject } from "@api";
import { useStringSetting } from "@utils";
import { getPitchInfosForSubject, RawVocabAccentData } from "@utils/pitchAccent.ts";

import vocabAccentData from "@data/vocab-accent.json";

import { PitchDiagramOnkaiShiki } from "./PitchDiagramOnkaiShiki.tsx";
import { PlainPrimaryReadings } from "./PlainPrimaryReadings.tsx";
import { AccentDiagramStyle } from "./accentDiagramTypes.ts";
import { PitchDiagramSenShiki } from "@pages/subject/readings/PitchDiagramSenShiki.tsx";

interface Props {
  subject: ApiSubject;
}

const database = vocabAccentData as unknown as RawVocabAccentData;

export default function PitchAccentDiagrams({ subject }: Props): React.ReactElement | null {
  const data = useMemo(() => getPitchInfosForSubject(database, subject), [subject]);
  const style = useStringSetting<AccentDiagramStyle>("pitchAccentDiagramStyle");

  if (!data || !data.length) {
    // Fall back to the plain readings if we don't have pitch accent data for this subject
    return <PlainPrimaryReadings subject={subject} />;
  }

  switch (style) {
  case "sen-shiki":
    return <div className="mt-md flex flex-col gap-sm leading-none">
      {data.map(({ reading, pitchInfos }, i) => <PitchDiagramSenShiki
        key={`${i}-${reading.reading}-${pitchInfos.length}`}
        reading={reading}
        pitchInfos={pitchInfos}
      />)}
    </div>;
  case "onkai-shiki":
  default:
    return <div className="mt-md flex flex-col gap-sm leading-none">
      {data.map(({ reading, pitchInfos }, i) => <PitchDiagramOnkaiShiki
        key={`${i}-${reading.reading}-${pitchInfos.length}`}
        reading={reading}
        pitchInfos={pitchInfos}
      />)}
    </div>;
  }
}
