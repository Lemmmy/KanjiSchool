// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { HeatmapDatum, HeatmapDay } from "./data";

import { Selection } from "d3-selection";
import { timeDays, timeMonth, timeMonths, timeWeek } from "d3-time";
import { range, index } from "d3-array";

import { ThemeName } from "@global/theme";

import Debug from "debug";
import dayjs from "dayjs";
const debug = Debug("kanjischool:heatmap-render");

const CELL_SIZE = 10;
const CELL_SPACING = 3;
const CELL_ROUNDING = 1;
const YEAR_HEADER = CELL_SIZE;
const YEAR_SPACING = CELL_SIZE * 2;
const YEAR_HEIGHT = (CELL_SIZE + CELL_SPACING) * 7;
export const YEAR_FULL_HEIGHT = YEAR_HEADER + YEAR_HEIGHT + YEAR_SPACING;
const FULL_WIDTH = 48 + ((CELL_SIZE + CELL_SPACING) * 53);

const FORMAT_DAYS_EN = ["", "Mon", "", "Wed", "", "Fri", ""];
const FORMAT_DAYS_JP = ["日", "月", "火", "水", "木", "金", "土"];
const formatDay = (d: Date, jp: boolean) =>
  (jp ? FORMAT_DAYS_JP : FORMAT_DAYS_EN)[d.getDay()];

const FORMAT_MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
  "Aug", "Sep", "Oct", "Nov", "Dec"];
const FORMAT_MONTHS_JP = ["1月", "2月", "3月", "4月", "5月", "6月", "7月",
  "8月", "9月", "10月", "11月", "12月"];
const formatMonth = (d: Date, jp: boolean) =>
  (jp ? FORMAT_MONTHS_JP : FORMAT_MONTHS_EN)[d.getMonth()];

export const COLOR_BLANK         = "#262626";
export const COLOR_BLANK_LIGHT   = "#e8e8e8";
export const COLORS              = ["#2b4051", "#305a7d", "#3675a8", "#3b8fd4", "#40a9ff"];
export const COLORS_LIGHT        = ["#a0cdf2", "#88c4f5", "#70bbf8", "#58b2fc", "#40a9ff"];
export const COLORS_FUTURE       = ["#35482b", "#456a2f", "#548d34", "#64af38", "#73d13d"];
export const COLORS_FUTURE_LIGHT = ["#c4ebae", "#b4e897", "#9ee079", "#84d455", "#73d13d"];

interface MonthDatum {
  d: Date;
  yearStart: Date;
}

interface DayDatum {
  d: Date;
  day?: HeatmapDay;
  year?: HeatmapDatum;
  yearStart: Date;
}

export function renderHeatmap(
  ctx: Selection<SVGSVGElement, HeatmapDatum, null, undefined>,
  data: HeatmapDatum[],
  jp: boolean,
  monthSep: boolean,
  theme: ThemeName = "dark",
  setHoverDay?: (d?: HeatmapDay) => void,
): void {
  debug("rendering heatmap with %d years", data.length);

  const yearsData = index(data, d => d.year);

  ctx.selectAll("g").remove();
  const group = ctx.append("g");
  let chartWidth = FULL_WIDTH;

  // Group for each year
  const year = group.selectAll("g")
    .data(data)
    .join("g")
    .attr("transform", (_, i) => `translate(48, ${YEAR_FULL_HEIGHT * i + CELL_SIZE * 1.5})`);

  // Year label
  const yearLabelClass = "fill-desc light:fill-black/75 [text-anchor:middle] text-sm font-bold " +
    "[writing-mode:vertical-lr] font-ja";
  year.append("text")
    .classed(yearLabelClass, true)
    .attr("transform", `translate(-32, ${(YEAR_HEIGHT - 6) / 2}) rotate(180)`)
    .text(d => d.year);

  // Extra stuff if we're showing the current year only (now - 8 months -> now + 4 months) and it spans two years
  if (data.length === 1) {
    const yearStart = data[0].yearStart;
    const yearEnd = data[0].yearEnd;

    if (yearEnd.getFullYear() !== yearStart.getFullYear()) {
      chartWidth += 32; // Add space for the extra year label

      // Extra year label on the right
      year.append("text")
        .classed(yearLabelClass, true)
        .attr("transform", `translate(${FULL_WIDTH - 36}, ${(YEAR_HEIGHT - 6) / 2}) rotate(180)`)
        .text(d => d.year + 1);
    }
  }

  // Month label
  year.append("g")
    .classed("fill-desc light:fill-black/75", true)
    .selectAll("text")
    .data<MonthDatum>(({ yearStart, yearEnd }) =>
      timeMonths(timeMonth.floor(yearStart), timeMonth.ceil(yearEnd))
        .filter(d => d >= yearStart && d <= yearEnd)
        .map(d => ({ d, yearStart })))
    .join("text")
    .classed("[text-anchor:start] text-[9px] font-ja", true)
    // TODO: Round weeks up like github?
    .attr("x", ({ d, yearStart }) => timeWeek.count(yearStart, d) * (CELL_SIZE + CELL_SPACING))
    .attr("y", 0)
    .attr("dy", "-0.5em")
    .text(({ d }) => formatMonth(d, jp));

  // Day label
  year.append("g")
    .classed("fill-desc light:fill-black/75", true)
    .selectAll("text")
    .data(y => range(7).map(i => new Date(y.year, 0, i)))
    .join("text")
    .classed("[text-anchor:end] text-[10px] font-ja", true)
    .attr("x", -4)
    .attr("y", d => d.getDay() * (CELL_SIZE + CELL_SPACING))
    .attr("dy", "0.85em")
    .text(d => formatDay(d, jp));

  // Day squares
  year.append("g")
    .classed("days", true)
    .selectAll("rect")
    // Use all days in the year as data, merge in the real data after
    .data<DayDatum>(({ year: y, yearStart, yearEnd }) => timeDays(yearStart, yearEnd).map(d => {
      const year = yearsData.get(y);
      const day = year?.dayMap.get(d);
      return { d, year, day, yearStart };
    }))
    .join("rect")
    .classed("cursor-pointer hover:brightness-150 light:hover:brightness-90", true)
    .attr("width", CELL_SIZE).attr("height", CELL_SIZE)
    .attr("rx", CELL_ROUNDING).attr("ry", CELL_ROUNDING)
    .attr("x", ({ d, yearStart }) =>
      timeWeek.count(yearStart, d) * (CELL_SIZE + CELL_SPACING))
    .attr("y", ({ d }) =>
      d.getDay() * (CELL_SIZE + CELL_SPACING))
    .attr("fill", ({ year, day }) => {
      if (!year || !day) return theme === "light" ? COLOR_BLANK_LIGHT : COLOR_BLANK;
      const scale = day.isFuture ? year.colorScaleFuture : year.colorScale;
      return scale(day.total);
    })
    .classed("stroke-green stroke-2 light:stroke-green-7", ({ d }) => dayjs(d).isToday())
    .on("mouseover", onDayMouseOver)
    .on("mouseout", onDayMouseOut);

  // Month paths
  if (monthSep) {
    year.append("g")
      .classed("stroke-[#565656] light:stroke-[#8c8c8c] fill-none [translate:-1px_-1px]", true)
      .selectAll("path")
      // Don't draw one for the last month
      .data<MonthDatum>(({ yearStart, yearEnd }) =>
        timeMonths(timeMonth.floor(yearStart), timeMonth.ceil(yearEnd))
          .filter(d => d >= yearStart && d <= yearEnd)
          .map(d => ({ d, yearStart }))
          .slice(0, -1))
      .enter()
      .append("path")
      .attr("shape-rendering", "crispEdges")
      .attr("d", pathMonth);
  }

  // Enforce svg size
  ctx
    .attr("width", chartWidth)
    .attr("height", YEAR_FULL_HEIGHT * data.length)
    .style("min-width", chartWidth + "px")
    .style("min-height", (YEAR_FULL_HEIGHT * data.length) + "px");

  ctx.exit().remove();

  function onDayMouseOver(_: any, { day }: DayDatum) {
    setHoverDay?.(day ?? undefined);
  }

  function onDayMouseOut() {
    setHoverDay?.(undefined);
  }
}

function pathMonth({ d: t0, yearStart }: MonthDatum) {
  const t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0); // Last day of month
  const d1 = t1.getDay(); // Last day of month's day of week
  const w1 = timeWeek.count(yearStart, t1); // Last day of month's week of year (according to chart's yearStart)
  const s = CELL_SIZE + CELL_SPACING; // Size of each cell including spacing

  if (d1 === 6) {
    // Last day of month is Saturday, so we can just draw a line down the right side
    return "M" + (w1 + 1) * s + "," + 7 * s // Start at bottom right
      + "V" + 0;                            // Draw a line up to the top
  } else {
    return "M" + w1 * s + "," + 7 * s // Start at bottom left
      + "V" + (d1 + 1) * s            // Draw a line up to the last day of the month
      + "H" + (w1 + 1) * s            // Draw a line across to the right side
      + "V" + 0;                      // Draw a line up to the top
  }
}
