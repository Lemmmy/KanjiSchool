// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { LegacyRef, SVGProps, useEffect, useMemo, useRef, useState } from "react";
import { Empty } from "antd";

import { ReviewForecast } from "@api";
import { usePalette, useStringSetting } from "@utils";

import { select } from "d3-selection";

import { chartHeight, renderChart, ReviewChartCurve } from "./renderChart.ts";
import { ChartDatum, generateChart } from "./data.ts";
import { ChartTooltip } from "./UpcomingReviewsChartTooltip.tsx";

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
  const curveType = useStringSetting<ReviewChartCurve>("dashboardReviewChartCurve");
  const data = useMemo(() => generateChart(forecast, maxDate), [forecast, maxDate]);

  const empty = data.length === 0 || data[data.length - 1].cumulative === 0;

  const el = useMemo(() => <UpcomingReviewsChartInner
    d3Ref={d3Ref}
    className="min-w-min mx-auto"
  />, [d3Ref]);

  // Render d3
  useEffect(() => {
    if (empty || !data || !d3Ref.current) return;
    const svg = select<SVGSVGElement, ChartDatum>(d3Ref.current);
    renderChart(svg, tooltipRef, setTooltipDatum, data, maxDays, theme, curveType);
  }, [empty, data, maxDays, theme, curveType]);

  if (empty) {
    return <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      className="flex flex-col items-center justify-center m-0"
      style={{ height: chartHeight }}
    />;
  } else {
    return <>
      {el}
      <ChartTooltip ref={tooltipRef} datum={tooltipDatum} />
    </>;
  }
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

