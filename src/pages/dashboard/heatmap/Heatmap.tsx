// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SVGProps, LegacyRef, useEffect, useMemo, useRef, useState } from "react";

import { select } from "d3-selection";
import { generateHeatmapData, HeatmapDatum, HeatmapDay } from "./data";
import { renderHeatmap, YEAR_FULL_HEIGHT } from "./renderHeatmap";

import { useAssignments, useLastReview } from "@api";

import { useBooleanSetting } from "@utils";
import { useThemeContext } from "@global/theme/ThemeContext.tsx";
import { Empty } from "antd";

interface Props extends SVGProps<SVGSVGElement> {
  currentYearOnly?: boolean;
  setHoverDay?: (d?: HeatmapDay) => void;
}

export function Heatmap({
  currentYearOnly = true,
  setHoverDay,
  ...props
}: Props): JSX.Element {
  const d3Ref = useRef<SVGSVGElement>(null);

  // Used to auto-refresh the heatmap
  const assignments = useAssignments();
  const lastReview = useLastReview();

  const jp = useBooleanSetting("reviewHeatmapJa");
  const monthSep = useBooleanSetting("reviewHeatmapMonthSep");
  const includeFuture = useBooleanSetting("reviewHeatmapIncludeFuture");

  const { theme } = useThemeContext();

  // Load the data asynchronously. Reload if assignments or lastReview change
  const [data, setData] = useState<HeatmapDatum[]>();
  useEffect(() => {
    generateHeatmapData(currentYearOnly, includeFuture, theme)
      .then(setData);
  }, [currentYearOnly, includeFuture, assignments, theme, lastReview]);

  const empty = !data || data.length === 0;

  const el = useMemo(() => empty
    ? (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        className="w-full flex flex-col items-center justify-center m-0"
        style={{ height: YEAR_FULL_HEIGHT }}
        description="No data this year"
      />
    )
    : (
      <HeatmapInner
        {...props}
        d3Ref={d3Ref}
      />
    ), [empty, d3Ref, props]);

  // Render d3
  useEffect(() => {
    if (empty || !data || !d3Ref.current) return;
    const svg = select<SVGSVGElement, HeatmapDatum>(d3Ref.current);
    renderHeatmap(svg, data, jp, monthSep, theme, setHoverDay);
  }, [empty, data, jp, monthSep, theme, setHoverDay]);

  return el;
}

interface InnerProps extends SVGProps<SVGSVGElement> {
  d3Ref: LegacyRef<SVGSVGElement>;
}

const HeatmapInner = ({ d3Ref, ...props }: InnerProps): JSX.Element | null => <svg
  {...props}
  ref={d3Ref}
  className="min-w-min mx-auto"
/>;
