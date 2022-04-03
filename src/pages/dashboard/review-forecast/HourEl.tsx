// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { HourData } from "./analyze";
import { ReviewForecastGrouping } from "./ReviewForecastCard";
import { Numbers } from "./Numbers";
import { HourBar } from "./HourBar";

interface Props extends HourData {
  grouping: ReviewForecastGrouping;
  hourMaxReviews: number;
}

export function HourEl({
  grouping,
  hourName, isNow,
  total, nonLevelUp, levelUp, radical, kanji, vocabulary,
  cum,
  hourMaxReviews: max
}: Props): JSX.Element {
  const classes = classNames("hour", { now: isNow });

  return <div className={classes}>
    {/* Hour name */}
    <span className="hour-name">
      {isNow ? "Now" : hourName}
    </span>

    {/* Progress bars */}
    <div className="bar-container">
      {/* `total` grouping (just a single bar) */}
      {grouping === "total" && <HourBar n={total} max={max} />}

      {/* `level_up` grouping (blue bar/green bar) */}
      {grouping === "level_up" &&
        <HourBar n={nonLevelUp} max={max} className="non-level-up" />}
      {grouping === "level_up" &&
        <HourBar n={levelUp} max={max} className="level-up" />}

      {/* `type` grouping (radical/kanji/vocabulary) */}
      {grouping === "type" &&
        <HourBar n={radical} max={max} className="radical" />}
      {grouping === "type" &&
        <HourBar n={kanji} max={max} className="kanji" />}
      {grouping === "type" &&
        <HourBar n={vocabulary} max={max} className="vocabulary" />}
    </div>

    {/* Review count/cumulative */}
    <Numbers reviews={total} cum={cum} />
  </div>;
}
