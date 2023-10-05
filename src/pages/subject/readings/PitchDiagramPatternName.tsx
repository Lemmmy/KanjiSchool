// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode, useMemo } from "react";
import { Tooltip } from "antd";

import { PitchInfo, PitchPattern } from "@utils/pitchAccent.ts";

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

interface Props {
  pitchInfo: PitchInfo;
}

export function PitchDiagramPatternName({ pitchInfo: { partOfSpeech, accentPos, pattern }}: Props): JSX.Element {
  const partsOfSpeech = useMemo(() => partOfSpeech
    ?.split(";")
    .map(pos => ({ ja: pos, en: partsOfSpeechMap[pos] ?? pos })),
  [partOfSpeech]);

  return <>
    {/* Accent position */}
    <div className="bg-white/15 light:bg-black/15 rounded-full p-xss leading-none text-desc w-6 h-6 flex items-center
      justify-center user-select-none">
      {accentPos}
    </div>

    {/* Pitch pattern */}
    <span className="text-base-c/70">
      {patternNames[pattern][0]}

      {/* Parts of speech */}
      {partsOfSpeech?.length && (
        <span className="text-base-c/50">
          &nbsp;
          ({partsOfSpeech.map((pos, i) =>
            <Tooltip key={`${i}-${pos}`} title={pos.en}>
              {pos.ja}{i < partsOfSpeech.length - 1 ? "; " : ""}
            </Tooltip>
          )})
        </span>
      )}
    </span>
  </>;
}

interface PitchDiagramPatternTooltipProps {
  pitchInfo: PitchInfo;
  children: ReactNode;
}

export function PitchDiagramPatternTooltip({ pitchInfo, children }: PitchDiagramPatternTooltipProps): JSX.Element {
  return <Tooltip
    title={patternNames[pitchInfo.pattern][1]}
    placement="right"
  >
    {children}
  </Tooltip>;
}
