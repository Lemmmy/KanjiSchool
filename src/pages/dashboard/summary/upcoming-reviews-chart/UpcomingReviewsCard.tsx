// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Card } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import classNames from "classnames";

import { shallowEqual } from "react-redux";
import { useAppSelector } from "@store";

import { UpcomingReviewsChart } from "./UpcomingReviewsChart.tsx";
import { useIntegerSetting } from "@utils";

import dayjs from "dayjs";

export default function UpcomingReviewsCard(): JSX.Element {
  const maxDays = useIntegerSetting("dashboardReviewChartDays");

  const nowMax = dayjs().startOf("hour").add(maxDays, "day");
  const nowMaxStr = nowMax.toISOString();

  const forecast = useAppSelector(s => s.sync.reviewForecast, shallowEqual);

  return <Card
    className="[&>.ant-card-body]:p-0 [&>.ant-card-body]:flex [&>.ant-card-body]:flex-col"
    title="Upcoming reviews"
    loading={!forecast}
    extra={<UpcomingReviewsExtra />}
  >
    <div className="pt-md px-lg pb-xs flex-1">
      {forecast && <UpcomingReviewsChart
        forecast={forecast}
        maxDate={nowMaxStr}
        maxDays={maxDays}
      />}
    </div>

    <CardFooter />
  </Card>;
}

function UpcomingReviewsExtra(): JSX.Element | null {
  const nextReviewsWeek = useAppSelector(s =>
    s.sync.nextReviewsAvailable.nextReviewsWeek);

  if (!nextReviewsWeek) return null;

  return <span className="text-desc">
    <b>{nextReviewsWeek}</b> upcoming in 7 days
  </span>;
}

function CardFooter(): JSX.Element | null {
  const { sm } = useBreakpoint();
  if (!sm) return null; // Hide footer entirely on mobile

  return <div className="py-sm px-md bg-white/4 border-solid border-0 border-t border-t-split text-desc text-sm">
    <div className="flex items-center justify-end">
      <LegendSquare label="Cumulative"
        className="bg-transparent border-2 border-solid border-reviews-cumulative border-box" />
      <LegendSquare label="Apprentice"
        className="bg-srs-apprentice" />
      <LegendSquare label="Guru"
        className="bg-srs-guru" />
      <LegendSquare label="Master"
        className="bg-srs-master" />
      <LegendSquare label="Enlightened"
        className="bg-srs-enlightened" />
    </div>
  </div>;
}

interface LegendSquareProps {
  label: string;
  className: string;
}

function LegendSquare({ className, label }: LegendSquareProps): JSX.Element {
  return <span className="text-sm text-desc whitespace-nowrap mr-sm last:mr-0">
    <span className={classNames(className, "inline-block w-[10px] h-[10px] rounded-sm mr-xs")} />
    {label}
  </span>;
}
