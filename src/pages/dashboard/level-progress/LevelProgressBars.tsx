// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { useCallback, useMemo } from "react";
import { Tooltip } from "antd";

import { useHistory } from "react-router-dom";
import { History } from "history";

import { LevelData, isComplete, SegmentData } from "./analyze";
import { gotoSearch } from "@api";

import { nts } from "@utils";

interface Props extends LevelData {
  userLevel: number;
  includePassed: boolean;
  // endRef?: Ref<HTMLDivElement>;
}

export function LevelProgressBars({
  userLevel,
  level,
  radicals,
  kanji,
  vocabulary,
  includePassed,
  // endRef
}: Props): JSX.Element {
  const showKanjiLine = userLevel === level;

  return <>
    <div className="level-progress-bars">
      <div className="level">{level}</div>

      <div className="bars">
        {!isComplete(radicals, includePassed) && (
          <LevelProgressBar level={level} type="radicals" data={radicals} />
        )}
        {!isComplete(kanji, includePassed) && (
          <LevelProgressBar level={level} type="kanji" data={kanji} showKanjiLine={showKanjiLine} />
        )}
        {!isComplete(vocabulary, includePassed) && (
          <LevelProgressBar level={level} type="vocabulary" data={vocabulary} />
        )}
      </div>
    </div>
    {/* {endRef && <div ref={endRef} />} */}
  </>;
}

interface BarProps {
  level: number;
  type: "radicals" | "kanji" | "vocabulary";
  data: SegmentData;
  showKanjiLine?: boolean;
}

function LevelProgressBar({
  level,
  type,
  data,
  showKanjiLine
}: BarProps): JSX.Element {
  const [locked, init, appr1, appr2, appr3, appr4, passed, total] = data;

  const history = useHistory();

  const perc = useCallback((n: number) => ((n / total) * 100) + "%", [total]);
  const percParen = useCallback((n: number) =>
    `${nts(n)}/${nts(total)} ` +
    `(${((n / total) * 100).toFixed(1)}%)`, [total]);

  const barPartProps = useMemo(() => ({ history, perc, percParen, level, type }),
    [history, perc, percParen, level, type]);

  // Title for hovering over the bar type
  const mainTitle = useMemo(() => <>
    <div className="level-head">Level {level} {type}</div>
    <div className="txt">{percParen(total - locked)} started</div>
    <div className="txt">{percParen(passed)} passed</div>
  </>, [level, type, percParen, total, locked, passed]);

  // Round the kanji line up to the nearest subject
  const kanjiLineN = Math.ceil(0.9 * total);

  return <div className="level-progress-bar">
    {/* R, K or V */}
    <Tooltip title={mainTitle} overlayClassName="level-progress-bar-main-tooltip">
      <span className="bar-type">
        {type.charAt(0).toUpperCase()}
      </span>
    </Tooltip>

    <div className="bar-container">
      <BarPart {...barPartProps} stage={"passed"} n={passed} />
      <BarPart {...barPartProps} stage={"appr4"} n={appr4} />
      <BarPart {...barPartProps} stage={"appr3"} n={appr3} />
      <BarPart {...barPartProps} stage={"appr2"} n={appr2} />
      <BarPart {...barPartProps} stage={"appr1"} n={appr1} />
      <BarPart {...barPartProps} stage={"init"} n={init} />
      <BarPart {...barPartProps} stage={"locked"} n={locked} />

      {/* Show a black line at 90% kanji to show where level-up would be */}
      {showKanjiLine && (
        <div className="kanji-line" style={{ left: perc(kanjiLineN)}} />
      )}
    </div>
  </div>;
}

type PercFn = (n: number) => string;
type PercParenFn = PercFn;
type BarPartStage = "locked" | "init" | "appr1" | "appr2" | "appr3" | "appr4"
  | "passed";
interface BarPartProps {
  history: History;
  perc: PercFn;
  percParen: PercParenFn;
  level: number;
  type: "radicals" | "kanji" | "vocabulary";
  stage: BarPartStage;
  n: number;
}

const BarPart = React.memo(function BarPart({
  history,
  perc, percParen,
  level, type, stage, n
}: BarPartProps): JSX.Element {
  // Title for the individual bar segment's tooltip
  const [rawTitle, srsStages] = barSegTitleAndStages(stage);
  const title = rawTitle + " - " + percParen(n);

  return <Tooltip title={title}>
    <div
      className={"bar bar-" + stage}
      style={{ width: perc(n) }}
      onClick={() => gotoSearch(history, {
        minLevel: level,
        maxLevel: level,
        subjectTypes: [type === "radicals" ? "radical" : type],
        srsStages,
        sortOrder: "SRS_THEN_TYPE"
      }, true, true)}
    />
  </Tooltip>;
});

function barSegTitleAndStages(stage: BarPartStage): [string, number[]] {
  switch (stage) {
  case "locked": return ["Locked", [10]];
  case "init": return ["Initiate", [0]];
  case "appr1": return ["Apprentice I", [1]];
  case "appr2": return ["Apprentice II", [2]];
  case "appr3": return ["Apprentice III", [3]];
  case "appr4": return ["Apprentice IV", [4]];
  case "passed": return ["Passed", [5, 6, 7, 8, 9]];
  }
}
