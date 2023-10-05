// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";

import { ApiSubjectReadingBase } from "@api";
import { PitchInfo, PitchPattern } from "@utils/pitchAccent.ts";

import { diagramSettings } from "./PitchDiagramSenShiki.tsx";
import { pitchDiagramColors } from "./pitchDiagramColors.ts";

interface Props {
  reading: ApiSubjectReadingBase;
  pitchInfo: PitchInfo;
}

export function PitchDiagramSenShikiAccents({ reading: { reading }, pitchInfo }: Props): JSX.Element {
  const { kanaSize, squareSize, lineStrokeWidth } = diagramSettings;

  const { mora, pattern, accentPos } = pitchInfo;
  const moraWidths = useMemo(() => mora.map((_, i) => {
    return squareSize * (mora[i]?.length ?? 1);
  }), [squareSize, mora]);

  const lowY = squareSize + lineStrokeWidth;
  // noinspection JSSuspiciousNameCombination
  const highY = lineStrokeWidth;

  const colors = pitchDiagramColors[pattern];

  const linePoints: string = useMemo(() => {
    const points: [number, number][] = [];

    let x = lineStrokeWidth;

    // For an atamadaka word, the first mora starts high, then goes low. For all other words, the first mora starts low.
    if (pattern === PitchPattern.Atamadaka) {
      // First mora starts high
      points.push([x, highY]);
      x += moraWidths[0];
      points.push([x, highY]);
      points.push([x, lowY]); // Then goes low

      // The rest of the word is low
      for (let i = 1; i < mora.length; i++) {
        x += moraWidths[i];
        points.push([x, lowY]);
      }
    } else {
      // First mora starts low
      points.push([x, lowY]);
      x += moraWidths[0];
      points.push([x, lowY]);
      points.push([x, highY]); // Then goes high

      if (pattern === PitchPattern.Heiban) {
        // The rest of the word is high
        for (let i = 1; i < mora.length; i++) {
          x += moraWidths[i];
          points.push([x, highY]);
        }
      } else {
        // The rest of the word up until the accentPos is high
        for (let i = 1; i < accentPos; i++) {
          x += moraWidths[i];
          points.push([x, highY]);
        }

        // Downstep line
        points.push([x, lowY]);

        // The rest of the word is low
        for (let i = accentPos; i < mora.length; i++) {
          x += moraWidths[i];
          points.push([x, lowY]);
        }
      }
    }

    return points.map(([x, y]) => `${x},${y}`).join(" ");
  }, [pattern, accentPos, moraWidths, lowY, highY]);

  return <svg
    width={squareSize * reading.length + (lineStrokeWidth * 2)}
    height={squareSize + (lineStrokeWidth * 2)}
    className="my-xss"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Text */}
    <text
      x={lineStrokeWidth * 2}
      y={kanaSize}
      className="fill-basec leading-none font-ja"
      textAnchor="start"
      style={{
        fontSize: kanaSize,
        letterSpacing: squareSize - kanaSize
      }}
    >
      {reading}
    </text>

    {/* Accent line */}
    <polyline
      points={linePoints}
      strokeWidth={lineStrokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      className={colors.stroke}
    />
  </svg>;
}
