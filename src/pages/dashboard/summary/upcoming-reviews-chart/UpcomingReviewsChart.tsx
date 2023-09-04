// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { LegacyRef, SVGProps, useEffect, useMemo, useRef, useState } from "react";

import { ReviewForecast } from "@api";
import { usePalette } from "@utils";

import { select } from "d3-selection";

import { renderChart } from "./renderChart.ts";
import { ChartDatum, generateChart } from "./data.ts";
import { ChartTooltip } from "@pages/dashboard/summary/upcoming-reviews-chart/UpcomingReviewsChartTooltip.tsx";

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

