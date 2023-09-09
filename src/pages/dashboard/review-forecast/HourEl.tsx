// Copyright (c) 2021-2023 Drew Edwards
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
  hours12h: boolean;
}

export function HourEl({
  grouping,
  hourName, isNow,
  total,
  nonLevelUp,
  levelUp,
  radical,
  kanji,
  vocabulary,
  cum,
  hours12h,
  hourMaxReviews: max
}: Props): JSX.Element {
  const classes = classNames(
    "flex items-center",
    {
      "bg-green-9 text-green light:bg-green-2/50 light:text-green-6": isNow
    }
  );

  const hourClasses = classNames(
    "inline-block py-xs px-md border-0 border-solid border-r border-r-white/20 light:border-r-black/10",
    {
      "font-bold": isNow,
      "w-[6.5em]": hours12h,
      "w-[5em]": !hours12h
    }
  );

  return <div className={classes}>
    {/* Hour name */}
    <span className={hourClasses}>
      {isNow ? "Now" : hourName}
    </span>

    {/* Progress bars */}
    <div className="flex-1 pr-md">
      {/* `total` grouping (just a single bar) */}
      {grouping === "total" && <HourBar n={total} max={max} />}

      {/* `level_up` grouping (blue bar/green bar) */}
      {grouping === "level_up" &&
        <HourBar n={nonLevelUp} max={max} type="non-level-up" />}
      {grouping === "level_up" &&
        <HourBar n={levelUp} max={max} type="level-up" bgClassName="bg-success" />}

      {/* `type` grouping (radical/kanji/vocabulary) */}
      {grouping === "type" &&
        <HourBar n={radical} max={max} type="radical" bgClassName="bg-radical" />}
      {grouping === "type" &&
        <HourBar n={kanji} max={max} type="kanji" bgClassName="bg-kanji" />}
      {grouping === "type" &&
        <HourBar n={vocabulary} max={max} type="vocabulary" bgClassName="bg-vocabulary" />}
    </div>

    {/* Review count/cumulative */}
    <Numbers
      reviews={total}
      cum={cum}
      isNow={isNow}
      className="mr-xs"
      sepHeightClass="h-[41px]"
    />
  </div>;
}
