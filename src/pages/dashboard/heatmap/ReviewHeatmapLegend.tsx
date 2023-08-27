// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { COLORS, COLORS_FUTURE } from "./renderHeatmap";

import { useBooleanSetting } from "@utils";

const LEGEND_COLORS = [...COLORS]; LEGEND_COLORS.reverse();
const LEGEND_COLORS_FUTURE = [...COLORS_FUTURE]; LEGEND_COLORS_FUTURE.reverse();

export function ReviewHeatmapLegend(): JSX.Element {
  const includeFuture = useBooleanSetting("reviewHeatmapIncludeFuture");

  return <div className="flex items-center">
    <div>{LEGEND_COLORS.map(c => <LegendSquare key={c} color={c} />)}</div>
    <span className="inline-block ml-xs mr-sm last:mr-0">Reviews</span>

    {includeFuture && <>
      <div>{LEGEND_COLORS_FUTURE.map(c => <LegendSquare key={c} color={c} />)}</div>
      <span className="inline-block ml-xs mr-sm last:mr-0">Upcoming reviews</span>
    </>}
  </div>;
}

function LegendSquare({ color }: { color: string }): JSX.Element {
  return <span
    className="inline-block w-[10px] h-[10px] whitespace-nowrap
      first:rounded-l-sm last:rounded-r-sm"
    style={{ background: color }}
  />;
}
