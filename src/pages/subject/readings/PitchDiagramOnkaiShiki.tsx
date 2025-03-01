// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { PitchInfo, } from "@utils/pitchAccent.ts";
import { PitchDiagramOnkaiShikiAccents } from "./PitchDiagramOnkaiShikiAccents.tsx";
import { ApiSubjectReadingBase } from "@api";
import {
  PitchDiagramPatternName,
  PitchDiagramPatternTooltip
} from "./PitchDiagramPatternName.tsx";

interface Props {
  reading: ApiSubjectReadingBase;
  pitchInfos: PitchInfo[];
}

export const diagramSettings = {
  kanaSize: 24,
  circleSize: 3,
  circleStrokeWidth: 1,
  lineStrokeWidth: 2
};

export function PitchDiagramOnkaiShiki({ reading, pitchInfos }: Props): JSX.Element {
  return <div className="flex flex-col items-start">
    {/* Pitch accent diagrams */}
    {pitchInfos.map((pitchInfo, i) =>
      <PitchRow
        key={`${i}-${pitchInfo.pattern}-${pitchInfo.accentPos}-${pitchInfo.partOfSpeech}`}
        pitchInfo={pitchInfo}
        reading={reading}
      />
    )}

    {/* Reading */}
    <div className="font-ja" style={{ fontSize: diagramSettings.kanaSize }}>
      {reading.reading}
    </div>
  </div>;
}

interface PitchRowProps {
  pitchInfo: PitchInfo;
  reading: ApiSubjectReadingBase;
}

function PitchRow({ pitchInfo, reading }: PitchRowProps) {
  return <PitchDiagramPatternTooltip pitchInfo={pitchInfo}>
    <div className="flex flex-row gap-xs items-center w-auto">
      <PitchDiagramOnkaiShikiAccents
        reading={reading}
        pitchInfo={pitchInfo}
      />

      <PitchDiagramPatternName pitchInfo={pitchInfo} />
    </div>
  </PitchDiagramPatternTooltip>;
}
