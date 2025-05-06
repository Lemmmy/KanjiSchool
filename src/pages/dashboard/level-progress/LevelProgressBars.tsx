// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { useCallback, useMemo } from "react";
import { Tooltip } from "antd";
import classNames from "classnames";

import { NavigateFunction, useNavigate } from "react-router-dom";

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
}: Props): React.ReactElement {
  const showKanjiLine = userLevel === level;

  return <>
    <div className="flex items-center justify-center select-none">
      <div className="flex-none pr-sm text-center relative top-[-2px]">{level}</div>

      <div className="flex-1">
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
}: BarProps): React.ReactElement {
  const [locked, init, appr1, appr2, appr3, appr4, passed, total] = data;

  const navigate = useNavigate();

  const perc = useCallback((n: number) => ((n / total) * 100) + "%", [total]);
  const percParen = useCallback((n: number) =>
    `${nts(n)}/${nts(total)} ` +
    `(${((n / total) * 100).toFixed(1)}%)`, [total]);

  const barPartProps = useMemo(() => ({ navigate, perc, percParen, level, type }),
    [navigate, perc, percParen, level, type]);

  // Title for hovering over the bar type
  const mainTitle = useMemo(() => <>
    <div className="w-full pb-[2px] border-0 border-solid border-b border-b-white/15 light:border-b-black/15">
      Level {level} {type}
    </div>

    <div className="text-desc text-sm">
      {percParen(total - locked)} started
    </div>

    <div className="text-desc text-sm">
      {percParen(passed)} passed
    </div>
  </>, [level, type, percParen, total, locked, passed]);

  // Round the kanji line up to the nearest subject
  const kanjiLineN = Math.ceil(0.9 * total);

  return <div className="flex justify-center w-[full] leading-[24px]">
    {/* R, K or V */}
    <Tooltip
      title={mainTitle}
      overlayClassName="[&_.ant-tooltip-inner]:text-center [&_.ant-tooltip-inner]:select-none"
      mouseLeaveDelay={0}
    >
      <span className="inline-block w-[24px] text-left text-sm text-desc align-middle">
        {type.charAt(0).toUpperCase()}
      </span>
    </Tooltip>

    <div className="w-full h-[24px] mb-xss flex-1 relative rounded-sm overflow-hidden">
      <BarPart {...barPartProps} stage={"passed"} n={passed} />
      <BarPart {...barPartProps} stage={"appr4"}  n={appr4} />
      <BarPart {...barPartProps} stage={"appr3"}  n={appr3} />
      <BarPart {...barPartProps} stage={"appr2"}  n={appr2} />
      <BarPart {...barPartProps} stage={"appr1"}  n={appr1} />
      <BarPart {...barPartProps} stage={"lesson"} n={init} />
      <BarPart {...barPartProps} stage={"locked"} n={locked} />

      {/* Show a black line at 90% kanji to show where level-up would be */}
      {showKanjiLine && (
        <div
          className="absolute top-0 bottom-0 w-[2px] bg-black"
          style={{ left: perc(kanjiLineN)}}
        />
      )}
    </div>
  </div>;
}

type PercFn = (n: number) => string;
type PercParenFn = PercFn;
type BarPartStage = "locked" | "lesson" | "appr1" | "appr2" | "appr3" | "appr4"
  | "passed";
interface BarPartProps {
  navigate: NavigateFunction;
  perc: PercFn;
  percParen: PercParenFn;
  level: number;
  type: "radicals" | "kanji" | "vocabulary";
  stage: BarPartStage;
  n: number;
}

const stageClasses: Record<BarPartStage, string> = {
  "locked": "bg-locked-stripes-dark hover:bg-srs-locked-darker " +
    "light:bg-locked-stripes-light light:hover:bg-srs-lesson-lighter",
  "lesson": "bg-srs-lesson hover:bg-srs-lesson-lighter",
  "appr1":  "bg-srs-apprentice-1 hover:bg-srs-apprentice-1-lighter",
  "appr2":  "bg-srs-apprentice-2 hover:bg-srs-apprentice-2-lighter",
  "appr3":  "bg-srs-apprentice-3 hover:bg-srs-apprentice-3-lighter",
  "appr4":  "bg-srs-apprentice-4 hover:bg-srs-apprentice-4-lighter",
  "passed": "bg-srs-passed hover:bg-srs-passed-lighter",
};

const BarPart = React.memo(function BarPart({
  navigate,
  perc, percParen,
  level, type, stage, n
}: BarPartProps): React.ReactElement {
  // Title for the individual bar segment's tooltip
  const [rawTitle, srsStages] = barSegTitleAndStages(stage);
  const title = rawTitle + " - " + percParen(n);

  return <Tooltip title={title}>
    <div
      className={classNames("inline-block h-[24px] cursor-pointer transition-colors", stageClasses[stage])}
      style={{ width: perc(n) }}
      onClick={() => gotoSearch(navigate, {
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
  case "lesson": return ["Lesson", [0]];
  case "appr1":  return ["Apprentice I", [1]];
  case "appr2":  return ["Apprentice II", [2]];
  case "appr3":  return ["Apprentice III", [3]];
  case "appr4":  return ["Apprentice IV", [4]];
  case "passed": return ["Passed", [5, 6, 7, 8, 9]];
  }
}
