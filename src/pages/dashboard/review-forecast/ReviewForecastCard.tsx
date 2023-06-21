// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo, useState, useEffect } from "react";
import { Card, Collapse, Empty } from "antd";
import classNames from "classnames";

import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "@store";

import { analyzeData, DayData } from "./analyze";
import { HourEl } from "./HourEl";
import { Numbers } from "./Numbers";

import { useBooleanSetting, useStringSetting } from "@utils";

export type ReviewForecastGrouping = "total" | "level_up" | "type";

export function ReviewForecastCard(): JSX.Element {
  const [activeKeys, setActiveKeys] = useState<string[]>();

  const grouping = useStringSetting<ReviewForecastGrouping>("dashboardReviewForecastGrouping");
  const hours12h = useBooleanSetting("dashboardReviewForecast12h");

  const forecast = useSelector((s: RootState) => s.sync.reviewForecast, shallowEqual);
  const data = useMemo(() => analyzeData(forecast, hours12h),
    [forecast, hours12h]);

  // Open the collapse panel for the first available review day
  useEffect(() => {
    if (!data || activeKeys) return;
    setActiveKeys([data.firstReviewDay.toString()]);
  }, [data, activeKeys]);

  function onChange(key: string | string[]) {
    setActiveKeys(typeof key === "string" ? [key] : key);
  }

  const isEmpty = data === false;
  const classes = classNames("review-forecast-card", {
    "card-empty": isEmpty,
    "hours-12h": hours12h
  });

  return <Card
    className={classes}
    title="Review forecast"
    loading={data === undefined}
  >
    {data /* Show the collapse if there are results, otherwise show Empty */
      ? (
        <Collapse
          ghost
          activeKey={activeKeys}
          onChange={onChange}
        >
          {data.dayData.map((d, i) =>
            generateDayEl(grouping, d, i, activeKeys))}
        </Collapse>
      )
      : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
  </Card>;
}

function generateDayEl(
  grouping: ReviewForecastGrouping,
  { dayName, hourMaxReviews, endReviews, endCum, hours }: DayData,
  dayIndex: number,
  activeKeys?: string[]
): JSX.Element {
  const isActive = activeKeys?.includes(dayIndex.toString());

  return <Collapse.Panel
    key={dayIndex}

    // Bold 'Today'
    header={dayName === "Today" ? <b>{dayName}</b> : dayName}

    // Don't make the panel expandable if there are no reviews
    collapsible={endReviews > 0 ? undefined : "disabled"}

    // Show the total reviews for this day + end cum if the panel is collapsed
    extra={isActive ? null : <Numbers reviews={endReviews} cum={endCum} />}
  >
    {hours.map(h => (
      <HourEl
        key={h.hourName}
        grouping={grouping}
        hourMaxReviews={hourMaxReviews}
        {...h}
      />
    ))}
  </Collapse.Panel>;
}
