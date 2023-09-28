// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RefObject } from "react";

import { Selection, pointer } from "d3-selection";
import { timeDay, timeHour, timeHours } from "d3-time";
import { scaleBand, scaleLinear, scaleTime } from "d3-scale";
import { axisBottom, axisLeft, axisTop } from "d3-axis";
import { bisect, max } from "d3-array";
import { curveMonotoneX, line, stack } from "d3-shape";
import { timeFormat } from "d3-time-format";

import { ChartDatum } from "./data";

import { ColorPalette } from "@global/theme";
import dayjs from "dayjs";

const chartHeight = 196;
const margins = [16, 16, 16, 32];
const colorMapping: Record<Exclude<keyof ChartDatum, "date" | "cumulative">, keyof ColorPalette> = {
  apprentice: "srsApprentice",
  guru: "srsGuru",
  master: "srsMaster",
  enlightened: "srsEnlightened"
};

const formatToday = timeFormat("%H:%M");
const formatOther = timeFormat("%a %H:%M");
const formatTick = (date: string) => {
  const d = new Date(date);
  return d.getDate() === new Date().getDate()
    ? formatToday(d)
    : formatOther(d);
};

export function renderChart(
  ctx: Selection<SVGSVGElement, ChartDatum, null, undefined>,
  tooltipRef: RefObject<HTMLDivElement>,
  setTooltipDatum: (d: ChartDatum | null) => void,
  data: ChartDatum[],
  maxDays: number,
  theme: ColorPalette
): void {
  /* eslint-disable indent */
  const chartWidth = Math.floor(ctx.node()?.getBoundingClientRect().width || 0);
  const width = chartWidth - margins[1] - margins[3];
  const height = chartHeight - margins[0] - margins[2];

  ctx.selectAll("g").remove();
  const group = ctx.append("g")
    .attr("transform", `translate(${margins[3]}, ${margins[0]})`);

  const subgroups = ["apprentice", "guru", "master", "enlightened"];

  // X axis
  const start = new Date(data[0].date);
  const end = dayjs(data[data.length - 1].date).add(1, "hour").toDate();

  const xTicks = timeHour.every(maxDays > 2 ? 12 : 6)!.range(start, end)
    .map(d => d.toISOString());
  xTicks.splice(0, 0, start.toISOString());

  const xBars = scaleBand()
    .range([0, width])
    .domain(timeHours(start, end)
      .map(d => d.toISOString()))
    .padding(0.2);
  const xAxis = group.append("g")
    .attr("transform", `translate(0, ${height - 1})`)
    .call(axisBottom(xBars)
      .tickValues(xTicks)
      .tickFormat(formatTick));
  xAxis.selectAll("path, line")
    .classed("stroke-[#404040] light:stroke-[#d9d9d9]", true);
  xAxis.selectAll("text")
    .classed("text-desc light:text-black/75", true);

  // X gridlines
  const xGridTicks = timeDay.every(1)!.range(start, end)
    .map(d => d.toISOString());

  const xGrid = group.append("g")
    .call(axisTop(xBars)
      .tickValues(xGridTicks)
      .tickSize(-height)
      .tickFormat(() => ""));
  xGrid.selectAll("path, line")
    .classed("stroke-[#313131] light:stroke-split", true);
  xGrid.selectAll("text")
    .remove();

  // Y axis
  const y = scaleLinear()
    .domain([0, max(data, d => d.cumulative) || 0])
    .rangeRound([height, 0]);
  const yAxis = group.append("g")
    .call(axisLeft(y));
  yAxis.selectAll("path, line")
    .classed("stroke-[#404040] light:stroke-[#d9d9d9]", true);
  yAxis.selectAll("text")
    .classed("text-desc light:text-black/75", true);

  // Y gridlines
  const yGrid = group.append("g")
    .call(axisLeft(y)
      .tickSize(-width)
      .tickFormat(() => ""));
  yGrid.selectAll("path, line")
    .classed("stroke-[#313131] light:stroke-split", true);
  yGrid.selectAll("text")
    .remove();

  // Bars
  const stackGenerator = stack<ChartDatum>()
    .keys(subgroups);
  const stackedData = stackGenerator(data);

  group.append("g")
    .selectAll("rect")
    .data(stackedData)
    .enter().append("g")
      .attr("fill", d => theme[colorMapping[d.key as keyof typeof colorMapping]])
      .selectAll("rect")
        .data(d => d)
        .enter().append("rect")
        .attr("x", d => xBars(d.data.date) || 0)
        .attr("y", d => y(d[1]))
        .attr("height", d => y(d[0]) - y(d[1]))
        .attr("width", xBars.bandwidth());

  // Cumulative line
  const xLine = scaleTime()
    .domain([start, end])
    .range([0, width]);
  group.append("path")
    .datum(data)
    .classed("stroke-reviews-cumulative-dark light:stroke-reviews-cumulative-light", true)
    .attr("fill", "none")
    .attr("stroke-width", 3)
    .attr("stroke-linejoin", "round")
    .attr("stroke-linecap", "round")
    .attr("d", line<ChartDatum>()
      .curve(curveMonotoneX)
      .x(d => xLine(dayjs(d.date).add(30, "minutes").toDate()) || 0) // Horizontally center on bars
      .y(d => Math.max(y(d.cumulative), 2))); // Don't allow line to escape chart

  ctx
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .on("mouseenter", onMouseEnter)
    .on("mousemove", onMouseMove)
    .on("mouseleave", onMouseLeave);

  ctx.exit().remove();

  function updateTooltip(event: MouseEvent) {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    const [x, y] = pointer(event, ctx.node()!);
    const xDate = xLine.invert(x - margins[3]);
    const closest = bisect(data.map(d => new Date(d.date)), xDate, 1);
    const d = data[closest - 1];

    tooltip.style.left = `${x + 40}px`;
    tooltip.style.top = `${y + 40}px`;
    setTooltipDatum(d);
  }

  function onMouseEnter(event: MouseEvent) {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    tooltip.classList.remove("hidden");
    updateTooltip(event);
  }

  function onMouseMove(event: MouseEvent) {
    updateTooltip(event);
  }

  function onMouseLeave() {
    const tooltip = tooltipRef.current;
    if (!tooltip) return;
    tooltip.classList.add("hidden");
  }

  /* eslint-enable indent */
}
