// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReviewForecast } from "@api";

import dayjs from "dayjs";

export interface HourData {
  /** Human-readable formatted hour (e.g. `15:00`) */
  hourName: string;
  /** Whether this is the current hour */
  isNow: boolean;

  /** Total number of reviews in this hour (for `total` grouping type) **/
  total: number;

  /** Number of non-level-up reviews (for `level_up` grouping type) **/
  nonLevelUp: number;
  /** Number of level-up reviews (for `level_up` grouping type) **/
  levelUp: number;

  /** Number of radical reviews (for `type` grouping type) **/
  radical: number;
  /** Number of kanji reviews (for `type` grouping type) **/
  kanji: number;
  /** Number of vocabulary reviews (for `type` grouping type) **/
  vocabulary: number;

  /** Cumulative number of reviews in this hour */
  cum: number;
}

export interface DayData {
  dayName: string;
  hourMaxReviews: number;
  endReviews: number;
  endCum: number;
  hours: HourData[];
}

export interface AnalyzedReviewForecast {
  firstReviewDay: number;
  dayData: DayData[];
}

export function analyzeData(
  forecast: ReviewForecast | undefined,
  hours12h?: boolean
): AnalyzedReviewForecast | false | undefined {
  if (!forecast) return;
  const {
    nonLevelUp, levelUp,
    radical, kanji, vocabulary,
    total, cum, sortedDates
  } = forecast;

  const now = dayjs();
  const dateFormat = hours12h ? "h:mm A" : "HH:mm";
  const nowHourName = now.startOf("hour").format(dateFormat);

  let firstReviewDay = -1;
  let endCum = 0; // Cumulative counter for the whole review forecast

  // Get the next 7 days of data, starting at today
  const dayData: DayData[] = [];
  for (let i = 0; i < 7; i++) {
    const day = now.add(i, "day").startOf("day");
    // Weekday name, or 'Today' for today
    const isToday = i === 0;
    const dayName = isToday ? "Today" : day.format("dddd");

    // Find the review hours that are within this day
    const dayEnd = day.add(1, "day");
    const dates = sortedDates.filter(s =>
      dayjs(s).isBetween(day, dayEnd, "hour", "[)"));

    let hourMaxReviews = 0; // The most reviews in an hour today, for bar width
    let endReviews = 0; // The number of reviews in this day

    // Iterate over the hours and figure out what to do
    const hours: HourData[] = [];
    for (const date of dates) {
      const hourName = dayjs(date).format(dateFormat);
      const reviews = total[date];
      const cumReviews = cum[date];

      // Insert the hour. If this hour has no reviews, don't insert it (it's
      // probably the first hour of the first day, which is always present).
      if (reviews > 0) {
        hours.push({
          hourName,
          isNow     : isToday && hourName === nowHourName,
          total     : reviews,
          nonLevelUp: nonLevelUp[date],
          levelUp   : levelUp[date],
          radical   : radical[date],
          kanji     : kanji[date],
          vocabulary: vocabulary[date],
          cum       : cumReviews
        });
      }

      // Update the relevant counters
      if (reviews > hourMaxReviews) hourMaxReviews = reviews;
      endReviews += reviews;
      endCum = cumReviews;
    }

    // Insert this day into the forecast
    dayData.push({ dayName, hourMaxReviews, endReviews, endCum, hours });

    // If this day has reviews, mark it as the first review day
    if (firstReviewDay === -1 && endReviews > 0) {
      firstReviewDay = i;
    }
  }

  // If there are no reviews for the next 7 days, return false
  if (endCum === 0) return false;

  return {
    firstReviewDay,
    dayData
  };
}
