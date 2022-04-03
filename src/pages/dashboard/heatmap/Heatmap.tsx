// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SVGProps, LegacyRef, useEffect, useMemo, useRef, useState } from "react";

import * as d3 from "d3";
import { generateHeatmapData, HeatmapDatum, HeatmapDay } from "./data";
import { renderHeatmap } from "./renderHeatmap";

import { useAssignments, useLastReview } from "@api";

import { useBooleanSetting } from "@utils";

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

  // Load the data asynchronously. Reload if assignments or lastReview change
  const [data, setData] = useState<HeatmapDatum[]>();
  useEffect(() => {
    generateHeatmapData(currentYearOnly, includeFuture)
      .then(setData);
  }, [currentYearOnly, includeFuture, assignments, lastReview]);

  const el = useMemo(() => <HeatmapInner
    {...props}
    d3Ref={d3Ref}
  />, [d3Ref, props]);

  // Render d3
  useEffect(() => {
    if (!data || !d3Ref.current) return;
    const svg = d3.select<SVGSVGElement, HeatmapDatum>(d3Ref.current);
    renderHeatmap(svg, data, jp, monthSep, setHoverDay);
  }, [data, jp, monthSep, setHoverDay]);

  return el;
}

interface InnerProps extends SVGProps<SVGSVGElement> {
  d3Ref: LegacyRef<SVGSVGElement>;
}

function HeatmapInner({ d3Ref, ...props }: InnerProps): JSX.Element | null {
  // TODO: Return something if no data
  return <svg
    {...props}
    ref={d3Ref}
    className="review-heatmap d3"
  />;
}
