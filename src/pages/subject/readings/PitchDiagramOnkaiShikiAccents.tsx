// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Fragment, useCallback, useMemo } from "react";
import classNames from "classnames";

import { ApiSubjectReadingBase } from "@api";
import { getMoraAccents, PitchInfo, PitchPattern } from "@utils/pitchAccent.ts";

import { diagramSettings } from "./PitchDiagramOnkaiShiki.tsx";

interface Props {
  reading: ApiSubjectReadingBase;
  pitchInfo: PitchInfo;
}

interface Colors {
  stroke: string;
  fill: string;
}

export const colorMap: Record<PitchPattern, Colors> = {
  [PitchPattern.Heiban]: {
    stroke: "stroke-[#eb2f96]",
    fill: "fill-[#eb2f96]",
  },
  [PitchPattern.Atamadaka]: {
    stroke: "stroke-orange-5",
    fill: "fill-orange-5",
  },
  [PitchPattern.Nakadaka]: {
    stroke: "stroke-blue-5",
    fill: "fill-blue-5",
  },
  [PitchPattern.Odaka]: {
    stroke: "stroke-green-5",
    fill: "fill-green-5",
  }
};

export function PitchDiagramOnkaiShikiAccents({ reading: { reading }, pitchInfo }: Props): JSX.Element {
  const accents = useMemo(() => getMoraAccents(pitchInfo), [pitchInfo]);
  const { kanaSize, circleSize, circleStrokeWidth, lineStrokeWidth } = diagramSettings;

  const lowY = circleSize + circleStrokeWidth + kanaSize;
  const highY = circleSize + circleStrokeWidth;

  const colors = colorMap[pitchInfo.pattern];

  const moraWidth = useCallback((moraIndex: number) => {
    return kanaSize * (pitchInfo.mora[moraIndex]?.length ?? 1);
  }, [kanaSize, pitchInfo.mora]);

  let x = 0;

  return <svg
    width={kanaSize * (reading.length + 1)}
    height={kanaSize + (circleSize * 2) + (circleStrokeWidth * 2)}
    className="my-xss"
    xmlns="http://www.w3.org/2000/svg"
  >
    {accents.map((accent, i) => {
      const w = moraWidth(i);
      const y = accent ? highY : lowY;

      const nextI = Math.min(i + 1, accents.length - 1);
      const nextX = x + w + (moraWidth(nextI) / 2);
      const nextY = accents[nextI] ? highY : lowY;

      const key = `${i}-${accent}-${pitchInfo.mora[i] ?? "particle"}`;

      const out = <Fragment key={key}>
        {/* Line */}
        {i < accents.length - 1 && <line
          x1={x + w / 2}
          y1={y}
          x2={nextX}
          y2={nextY}
          strokeWidth={lineStrokeWidth}
          className={colors.stroke}
        />}

        {/* Dot */}
        <circle
          cx={x + w / 2}
          cy={y}
          r={circleSize}
          strokeWidth={circleStrokeWidth}
          className={classNames(colors.stroke, {
            [colors.fill]: i < accents.length - 1,
            "fill-black light:fill-white": i === accents.length - 1,
          })}
        />
      </Fragment>;

      x += w;
      return out;
    })}
  </svg>;
}
