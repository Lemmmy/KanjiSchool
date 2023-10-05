// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { PitchInfo, PitchPattern } from "@utils/pitchAccent.ts";
import { PitchDiagramOnkaiShikiAccents } from "./PitchDiagramOnkaiShikiAccents.tsx";
import { ApiSubjectReadingBase } from "@api";
import { Tooltip } from "antd";
import { useMemo } from "react";

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

const patternNames: Record<PitchPattern, [string, string]> = {
  [PitchPattern.Heiban]:    ["平板", "Heiban"],
  [PitchPattern.Atamadaka]: ["頭高", "Atamadaka"],
  [PitchPattern.Nakadaka]:  ["中高", "Nakadaka"],
  [PitchPattern.Odaka]:     ["尾高", "Odaka"]
};

const partsOfSpeechMap: Record<string, string> = {
  // These appear in accents.txt
  "代"  : "pronoun",
  "名"  : "noun",
  "副"  : "adverb",
  "形"  : "adjective",
  "形動": "adjective",
  "感"  : "expression",
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
  reading  : ApiSubjectReadingBase;
}

function PitchRow({ pitchInfo, reading }: PitchRowProps) {
  const partsOfSpeech = useMemo(() => pitchInfo.partOfSpeech
    ?.split(";")
    .map(pos => ({ ja: pos, en: partsOfSpeechMap[pos] ?? pos })),
  [pitchInfo.partOfSpeech]);

  return <Tooltip
    title={patternNames[pitchInfo.pattern][1]}
    placement="right"
  >
    <div className="flex flex-row gap-xs items-center w-auto">
      <PitchDiagramOnkaiShikiAccents
        reading={reading}
        pitchInfo={pitchInfo}
      />

      {/* Accent position */}
      <div className="bg-white/15 light:bg-black/15 rounded-full p-xss leading-none text-desc w-6 h-6
            flex items-center justify-center user-select-none">
        {pitchInfo.accentPos}
      </div>

      {/* Pitch pattern */}
      <span className="text-base-c/70">
        {patternNames[pitchInfo.pattern][0]}

        {/* Parts of speech */}
        {partsOfSpeech?.length && (
          <span className="text-base-c/50">
            &nbsp;({partsOfSpeech.map((pos, i) =>
              <Tooltip key={`${i}-${pos}`} title={pos.en}>
                {pos.ja}{i < partsOfSpeech.length - 1 ? "; " : ""}
              </Tooltip>
            )})
          </span>
        )}
      </span>
    </div>
  </Tooltip>;
}
