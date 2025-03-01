// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { COLORS, COLORS_FUTURE, COLORS_FUTURE_LIGHT, COLORS_LIGHT } from "./renderHeatmap";

import { useBooleanSetting } from "@utils";
import { useThemeContext } from "@global/theme/ThemeContext.tsx";

const LEGEND_COLORS              = [...COLORS];              LEGEND_COLORS.reverse();
const LEGEND_COLORS_LIGHT        = [...COLORS_LIGHT];        LEGEND_COLORS_LIGHT.reverse();
const LEGEND_COLORS_FUTURE       = [...COLORS_FUTURE];       LEGEND_COLORS_FUTURE.reverse();
const LEGEND_COLORS_FUTURE_LIGHT = [...COLORS_FUTURE_LIGHT]; LEGEND_COLORS_FUTURE_LIGHT.reverse();

export function ReviewHeatmapLegend(): JSX.Element {
  const includeFuture = useBooleanSetting("reviewHeatmapIncludeFuture");

  const { theme } = useThemeContext();
  const legendColors       = theme === "light" ? LEGEND_COLORS_LIGHT : LEGEND_COLORS;
  const legendColorsFuture = theme === "light" ? LEGEND_COLORS_FUTURE_LIGHT : LEGEND_COLORS_FUTURE;

  return <div className="flex items-center">
    <div>{legendColors.map(c => <LegendSquare key={c} color={c} />)}</div>
    <span className="inline-block ml-xs mr-sm last:mr-0">Reviews</span>

    {includeFuture && <>
      <div>{legendColorsFuture.map(c => <LegendSquare key={c} color={c} />)}</div>
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
