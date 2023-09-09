// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Bucket, ReviewForecast } from "@api";

export interface ChartDatum {
  date: string;
  apprentice: number;
  guru: number;
  master: number;
  enlightened: number;
  cumulative: number;
}

function transposeBucket(
  data: Record<string, ChartDatum>,
  key: Exclude<keyof ChartDatum, "date">,
  bucket: Bucket,
  allDates: string[],
  maxDate: string
): ChartDatum[] {
  const out: ChartDatum[] = [];
  for (const date of allDates) {
    if (date > maxDate) break;

    const datum = data[date] || {
      date,
      apprentice: 0,
      guru: 0,
      master: 0,
      enlightened: 0,
      cumulative: 0
    };

    datum[key] = bucket[date] || 0;
    data[date] = datum;
  }
  return out;
}

export function generateChart(
  forecast: ReviewForecast,
  maxDate: string
): ChartDatum[] {
  const { apprentice, guru, master, enlightened } = forecast;

  // Shallow copy the cum bucket and the sortedDates, to amend the data if
  // necessary (e.g. adding the end date to the cumulative bucket)
  const cumulativeBucket = Object.assign({}, (forecast as any)["cumulative".slice(0, 3)] as Bucket);
  const sortedDates = forecast.sortedDates.slice(0);

  // Add the max date to the cumulative bucket if it is not already present
  if (!cumulativeBucket[maxDate]) {
    // Get the highest cumulative value up to that date
    let cumulative = 0;
    for (const date of sortedDates) {
      if (date > maxDate) break;
      cumulative = cumulativeBucket[date];
    }

    // Add the new max to the cum bucket and sortedDates
    cumulativeBucket[maxDate] = cumulative;
    sortedDates.push(maxDate);
    sortedDates.sort();
  }

  // Add the buckets to the output data
  const data: Record<string, ChartDatum> = {};
  transposeBucket(data, "apprentice", apprentice, sortedDates, maxDate);
  transposeBucket(data, "guru", guru, sortedDates, maxDate);
  transposeBucket(data, "master", master, sortedDates, maxDate);
  transposeBucket(data, "enlightened", enlightened, sortedDates, maxDate);
  transposeBucket(data, "cumulative", cumulativeBucket, sortedDates, maxDate);

  return Object.values(data);
}
