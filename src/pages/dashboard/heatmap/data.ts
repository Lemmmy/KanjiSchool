// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiReview, StoredAssignment } from "@api";
import { db } from "@db";

import { timeYear, timeDay, timeMonth } from "d3-time";
import { rollup, sort, union, map, group, index, extent, InternMap } from "d3-array";
import { scaleQuantize, ScaleQuantize } from "d3-scale";

import { COLORS, COLORS_FUTURE, COLORS_FUTURE_LIGHT, COLORS_LIGHT } from "./renderHeatmap";
import { ThemeName } from "@global/theme";

import Debug from "debug";
const debug = Debug("kanjischool:heatmap-data");

export interface HeatmapDay {
  total: number;
  reviews: number;
  lessons: number;
  future: number;

  date: Date;
  isFuture?: boolean;
}

export interface HeatmapDatum {
  year: number;
  yearStart: Date;
  yearEnd: Date;

  min: number;
  max: number;
  colorScale: ScaleQuantize<string, never>;
  colorScaleFuture: ScaleQuantize<string, never>;

  dayMap: InternMap<Date, HeatmapDay>;
}

export async function generateHeatmapData(
  currentYearOnly: boolean,
  includeFuture: boolean,
  theme: ThemeName = "dark"
): Promise<HeatmapDatum[]> {
  const now = new Date();
  const todayDate = timeDay.floor(now);
  const today = +todayDate;

  // If we're only showing the current year, show the period of [8 months ago, 4 months from now]. Otherwise, show the
  // full year from start to finish (so we only need reviews up until the end of this year).
  const yearStart = currentYearOnly
    ? timeMonth.offset(todayDate, -8)
    : timeYear.floor(now);
  const yearEnd = currentYearOnly
    ? timeMonth.offset(todayDate, 4) // TODO: Get this data from SpacedRepetitionSystems instead of hardcoding it
    : timeYear.ceil(now);
  debug("year start: %o  year end: %o", yearStart, yearEnd);

  let lessons: StoredAssignment[];
  let reviews: ApiReview[];
  if (currentYearOnly) {
    // Get all the data from the current year (in the user's timezone).
    // Dates are stored in ISO-8601 in the database and toISOString() will
    // always return a UTC string, so we can do a simple string comparison like
    // this
    reviews = await db.reviews
      .where("data_updated_at")
      .aboveOrEqual(yearStart.toISOString())
      .toArray();

    lessons = await db.assignments
      .where("data.started_at")
      .aboveOrEqual(yearStart.toISOString())
      .toArray();
  } else {
    // Get all reviews we have
    reviews = await db.reviews.toArray();
    lessons = await db.assignments.toArray();
  }

  const futures = !includeFuture ? [] : await db.assignments
    .where("data.available_at")
    .between(now.toISOString(), yearEnd.toISOString(), true)
    .toArray();

  debug("got %d reviews, %d lessons, %d future",
    reviews.length, lessons.length, futures.length);

  // Group the reviews, lessons and futures into day and count
  const rolledReviews = rollup(reviews, v => v.length,
    d => timeDay.floor(new Date(d.data_updated_at)));
  const rolledLessons = rollup(lessons, v => v.length,
    d => timeDay.floor(new Date(d.data.started_at!)));
  const rolledFutures = rollup(futures, v => v.length,
    d => timeDay.floor(new Date(d.data.available_at!)));
  debug("rolled: %d reviews, %d lessons, %d futures",
    rolledReviews.size, rolledLessons.size, rolledFutures.size);

  // Zip all the rollups together into HeatmapDay[]
  const dayKeys = sort(union(
    rolledReviews.keys(),
    rolledLessons.keys(),
    rolledFutures.keys())
  );
  const days = map<Date, HeatmapDay>(dayKeys, date => {
    const reviewsN = rolledReviews.get(date) ?? 0;
    const lessonsN = rolledLessons.get(date) ?? 0;
    const futuresN = rolledFutures.get(date) ?? 0;

    return {
      total: reviewsN + lessonsN + futuresN,
      reviews: reviewsN,
      lessons: lessonsN,
      future: futuresN,

      date,
      isFuture: +date > today
    };
  });

  // Group again into years
  const years = currentYearOnly
    ? new InternMap([[todayDate.getFullYear(), days]])
    : group(days, d => d.date.getFullYear());

  const yearsArray = Array.from(years, ([year, days]) => {
    // Turn the HeatmapDay[] back into an InternMap
    const dayMap = index(days, d => d.date);

    // Get the min and max number of reviews for the whole year
    const [min, max] = extent(days, d => d.total);

    // Generate the color scales
    const baseScale = () => scaleQuantize<string>()
      .domain([min ?? 0, max ?? 1]);
    const colorScale = baseScale()
      .range(theme === "light" ? COLORS_LIGHT : COLORS);
    const colorScaleFuture = baseScale()
      .range(theme === "light" ? COLORS_FUTURE_LIGHT : COLORS_FUTURE);

    return {
      year,
      yearStart: currentYearOnly ? yearStart : new Date(year, 0, 1),
      yearEnd: currentYearOnly ? yearEnd : new Date(year + 1, 0, 1),

      min: min ?? 0,
      max: max ?? 1,
      colorScale,
      colorScaleFuture,

      dayMap
    };
  });

  yearsArray.reverse(); // Sort by year descending
  return yearsArray.filter(y => y.year > 1970); // lol
}
