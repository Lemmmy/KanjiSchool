// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo, useState, useEffect, useCallback } from "react";
import { Collapse, CollapseProps, Empty } from "antd";
import classNames from "classnames";

import { shallowEqual } from "react-redux";
import { useAppSelector } from "@store";

import { analyzeData, AnalyzedReviewForecast, DayData } from "./analyze";
import { HourEl } from "./HourEl";
import { Numbers } from "./Numbers";

import { useBooleanSetting, useStringSetting } from "@utils";
import { SimpleCard } from "@comp/SimpleCard.tsx";
import { dashboardCardClass, dashboardEmptyableCardBodyClass } from "../sharedStyles.ts";

export type ReviewForecastGrouping = "total" | "level_up" | "type";

export function ReviewForecastCard(): JSX.Element {
  const [activeKeys, setActiveKeys] = useState<string[]>();

  const grouping = useStringSetting<ReviewForecastGrouping>("dashboardReviewForecastGrouping");
  const hours12h = useBooleanSetting("dashboardReviewForecast12h");

  const forecast = useAppSelector(s => s.reviews.reviewForecast, shallowEqual);
  const data = useMemo(() => analyzeData(forecast, hours12h),
    [forecast, hours12h]);
  const items = useMemo(() => generateCollapseItems(data, grouping, hours12h, activeKeys),
    [data, grouping, hours12h, activeKeys]);

  // Open the collapse panel for the first available review day
  useEffect(() => {
    if (!data || activeKeys) return;
    setActiveKeys([data.firstReviewDay.toString()]);
  }, [data, activeKeys]);

  const onChange = useCallback((key: string | string[]) => {
    setActiveKeys(typeof key === "string" ? [key] : key);
  }, []);

  const isEmpty = data === false;
  const collapseClasses = classNames(
    "[&_.ant-collapse-ghost>.ant-collapse-item>.ant-collapse-content>.ant-collapse-content-box]:p-0",
    // Repair the ghost styles
    "[&_.ant-collapse-header]:border-0",
    "[&_.ant-collapse-header]:border-solid",
    "[&_.ant-collapse-header]:border-b",
    "[&_.ant-collapse-header]:border-b-split",
    "[&_.ant-collapse-header]:select-none",
    "[&_.ant-collapse-item:last-child:not(.ant-collapse-item-active)_.ant-collapse-header]:border-b-0",
    "[&_.ant-collapse-item:not(:last-child)_.ant-collapse-content-box]:border-0",
    "[&_.ant-collapse-item:not(:last-child)_.ant-collapse-content-box]:border-solid",
    "[&_.ant-collapse-item:not(:last-child)_.ant-collapse-content-box]:border-b",
    "[&_.ant-collapse-item:not(:last-child)_.ant-collapse-content-box]:border-b-split"
  );

  return <SimpleCard
    title="Review forecast"
    loading={data === undefined}

    className={classNames(dashboardCardClass, collapseClasses)}
    bodyClassName={classNames(dashboardEmptyableCardBodyClass(isEmpty), "overflow-y-auto max-h-[420px]")}
    flush
  >
    {data /* Show the collapse if there are results, otherwise show Empty */
      ? (
        <Collapse
          ghost
          activeKey={activeKeys}
          onChange={onChange}
          items={items}
        />
      )
      : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
  </SimpleCard>;
}

function generateDayEl(
  grouping: ReviewForecastGrouping,
  { dayName, hourMaxReviews, endReviews, endCum, hours }: DayData,
  dayIndex: number,
  hours12h: boolean,
  activeKeys?: string[],
): NonNullable<CollapseProps["items"]>[number] {
  const isActive = activeKeys?.includes(dayIndex.toString());

  return {
    key: dayIndex.toString(),

    // Bold 'Today'
    label: dayName === "Today"
      ? <b>{dayName}</b>
      : dayName,

    // Don't make the panel expandable if there are no reviews
    collapsible: endReviews <= 0
      ? "disabled"
      : undefined,

    // Show the total reviews for this day + end cum if the panel is collapsed
    extra: !isActive
      ? <Numbers reviews={endReviews} cum={endCum}/>
      : null,

    children: hours.map(h => (
      <HourEl
        key={h.hourName}
        grouping={grouping}
        hourMaxReviews={hourMaxReviews}
        hours12h={hours12h}
        {...h}
      />
    ))
  };
}

function generateCollapseItems(
  data: AnalyzedReviewForecast | false | undefined,
  grouping: ReviewForecastGrouping,
  hours12h: boolean,
  activeKeys: string[] | undefined,
): CollapseProps["items"] {
  if (!data) return [];

  return data.dayData.map((d, i) =>
    generateDayEl(grouping, d, i, hours12h, activeKeys));
}
