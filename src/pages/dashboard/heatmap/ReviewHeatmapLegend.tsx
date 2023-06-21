// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { COLORS, COLORS_FUTURE } from "./renderHeatmap";

import { useBooleanSetting } from "@utils";

const LEGEND_COLORS = [...COLORS]; LEGEND_COLORS.reverse();
const LEGEND_COLORS_FUTURE = [...COLORS_FUTURE]; LEGEND_COLORS_FUTURE.reverse();

export function ReviewHeatmapLegend(): JSX.Element {
  const includeFuture = useBooleanSetting("reviewHeatmapIncludeFuture");

  return <div className="heatmap-legend">
    <div className="squares">
      {LEGEND_COLORS.map(c =>
        <span key={c} className="legend-square" style={{ background: c }} />)}
    </div>
    <span className="legend-label">Reviews</span>

    {includeFuture && <>
      <div className="squares">
        {LEGEND_COLORS_FUTURE.map(c =>
          <span key={c} className="legend-square" style={{ background: c }} />)}
      </div>
      <span className="legend-label">Upcoming reviews</span>
    </>}
  </div>;
}
