// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiReview, StoredAssignment } from "@api";
import { db } from "@db";

import { ScaleQuantize, InternMap } from "d3";
import { timeYear, timeDay } from "d3-time";
import { rollup, sort, union, map, group, index, extent } from "d3-array";
import { scaleQuantize } from "d3-scale";

import { COLORS, COLORS_FUTURE } from "./renderHeatmap";

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
  includeFuture: boolean
): Promise<HeatmapDatum[]> {
  const now = new Date();
  const today = +timeDay.floor(now);
  const yearEnd = timeYear.ceil(now);

  let lessons: StoredAssignment[];
  let reviews: ApiReview[];
  if (currentYearOnly) {
    // Get all the data from the current year (in the user's timezone)
    const yearStart = timeYear.floor(now);
    debug("year start: %o", yearStart);

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
    rolledReviews.keys(), rolledLessons.keys(), rolledFutures.keys()
  ));
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
  const years = group(days, d => d.date.getFullYear());
  const yearsArray = Array.from(years, ([year, days]) => {
    // Turn the HeatmapDay[] back into an InternMap
    const dayMap = index(days, d => d.date);

    // Get the min and max number of reviews for the whole year
    const [min, max] = extent(days, d => d.total);

    // Generate the color scales
    const baseScale = () => scaleQuantize<string>()
      .domain([min ?? 0, max ?? 1]);
    const colorScale = baseScale().range(COLORS);
    const colorScaleFuture = baseScale().range(COLORS_FUTURE);

    return {
      year,
      yearStart: new Date(year, 0, 1),
      yearEnd: new Date(year + 1, 0, 1),

      min: min ?? 0,
      max: max ?? 1,
      colorScale,
      colorScaleFuture,

      dayMap
    };
  });
  yearsArray.reverse(); // Sort by year descending

  return yearsArray.filter(y => y.year !== 1970); // lol
}
