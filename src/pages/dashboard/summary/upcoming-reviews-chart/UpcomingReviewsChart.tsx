// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { forwardRef, LegacyRef, SVGProps, useEffect, useMemo, useRef, useState } from "react";

import { ReviewForecast } from "@api";
import { pluralN, usePalette } from "@utils";

import { select } from "d3-selection";
import { timeFormat } from "d3-time-format";

import { renderChart } from "./renderChart.ts";
import { ChartDatum, generateChart } from "./data.ts";
import { DeepNonNullable } from "utility-types";
import classNames from "classnames";

interface Props {
  forecast: ReviewForecast;
  maxDate: string;
  maxDays: number;
}

export function UpcomingReviewsChart({
  forecast,
  maxDate,
  maxDays
}: Props): JSX.Element {
  const d3Ref = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [tooltipDatum, setTooltipDatum] = useState<ChartDatum | null>(null);

  const theme = usePalette();
  const data = useMemo(() => generateChart(forecast, maxDate), [forecast, maxDate]);

  const el = useMemo(() => <UpcomingReviewsChartInner
    d3Ref={d3Ref}
    className="min-w-min mx-auto"
  />, [d3Ref]);

  // Render d3
  useEffect(() => {
    if (!data || !d3Ref.current) return;
    const svg = select<SVGSVGElement, ChartDatum>(d3Ref.current);
    renderChart(svg, tooltipRef, setTooltipDatum, data, maxDays, theme);
  }, [data, maxDays, theme]);

  return <>
    {el}

    <ChartTooltip ref={tooltipRef} datum={tooltipDatum} />
  </>;
}

interface InnerProps extends SVGProps<SVGSVGElement> {
  d3Ref: LegacyRef<SVGSVGElement>;
}

function UpcomingReviewsChartInner({ d3Ref, ...props }: InnerProps): JSX.Element | null {
  return <svg
    {...props}
    ref={d3Ref}
    className="w-full mx-auto relative select-none"
  />;
}

interface ChartTooltipProps {
  datum: ChartDatum | null;
}

const dateFormat = timeFormat("%a %-d %b, %-I:%M %p");

const ChartTooltip = forwardRef<HTMLDivElement, ChartTooltipProps>(function ChartTooltip({ datum }, ref): JSX.Element {
  return <div
    ref={ref}
    className="absolute pointer-events-none bg-spotlight text-solid px-md py-sm rounded shadow-lg hidden
     whitespace-nowrap z-50"
  >
    {datum && <ChartTooltipInner datum={datum} />}
  </div>;
});

function ChartTooltipInner({ datum: d }: DeepNonNullable<ChartTooltipProps>): JSX.Element | null {
  const date = useMemo(() => new Date(d.date), [d.date]);
  const total = d.apprentice + d.guru + d.master + d.enlightened;

  return <>
    <div className="text-md font-bold">{dateFormat(date)}</div>
    <div className="text-sm text-green-4 text-center mt-xss mb-xs">{pluralN(total, "new review")}</div>

    <div className="flex flex-col gap-xs">
      <ChartTooltipRow label="Cumulative" value={d.cumulative}
        className="bg-transparent border-2 border-solid border-reviews-cumulative border-box" />
      <ChartTooltipRow label="Apprentice" value={d.apprentice}
        className="bg-srs-apprentice" />
      <ChartTooltipRow label="Guru" value={d.guru}
        className="bg-srs-guru" />
      <ChartTooltipRow label="Master" value={d.master}
        className="bg-srs-master" />
      <ChartTooltipRow label="Enlightened" value={d.enlightened}
        className="bg-srs-enlightened" />
    </div>
  </>;
}

interface ChartTooltipRowProps {
  label: string;
  value: number;
  className?: string;
}

function ChartTooltipRow({ label, value, className }: ChartTooltipRowProps): JSX.Element {
  return <div className="flex items-center leading-none">
    <div className={classNames(className, "w-4 h-4 inline-block mr-sm rounded-sm")} />
    <span className="text-base-c text-sm">{label}: <b>{value}</b></span>
  </div>;
}
