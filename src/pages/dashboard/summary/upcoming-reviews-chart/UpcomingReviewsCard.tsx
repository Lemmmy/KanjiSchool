// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import classNames from "classnames";

import { shallowEqual } from "react-redux";
import { useAppSelector } from "@store";

import { UpcomingReviewsChart } from "./UpcomingReviewsChart.tsx";

import { SimpleCard } from "@comp/SimpleCard.tsx";
import { dashboardCardBodyClass, dashboardCardClass } from "../../sharedStyles.ts";

import { useIntegerSetting } from "@utils";
import dayjs from "dayjs";

export default function UpcomingReviewsCard(): React.ReactElement {
  const maxDays = useIntegerSetting("dashboardReviewChartDays");

  const nowMax = dayjs().startOf("hour").add(maxDays, "day");
  const nowMaxStr = nowMax.toISOString();

  const forecast = useAppSelector(s => s.reviews.reviewForecast, shallowEqual);

  return <SimpleCard
    className={dashboardCardClass}
    bodyClassName={classNames(dashboardCardBodyClass, "flex flex-col")}
    flush
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
  </SimpleCard>;
}

function UpcomingReviewsExtra(): React.ReactElement | null {
  const nextReviewsWeek = useAppSelector(s =>
    s.reviews.nextReviewsAvailable.nextReviewsWeek);

  if (!nextReviewsWeek) return null;

  return <span className="text-desc">
    <b>{nextReviewsWeek}</b> upcoming in 7 days
  </span>;
}

function CardFooter(): React.ReactElement | null {
  const { sm } = useBreakpoint();
  if (!sm) return null; // Hide footer entirely on mobile

  return <div className="py-sm px-md bg-white/4 border-solid border-0 border-t border-t-split text-desc text-sm">
    <div className="flex items-center justify-end">
      <LegendSquare label="Cumulative"
        className="bg-transparent border-2 border-solid border-reviews-cumulative-dark
          light:border-reviews-cumulative-light border-box" />
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

function LegendSquare({ className, label }: LegendSquareProps): React.ReactElement {
  return <span className="text-sm text-desc whitespace-nowrap mr-sm last:mr-0">
    <span className={classNames(className, "inline-block w-[10px] h-[10px] rounded-sm mr-xs")} />
    {label}
  </span>;
}
