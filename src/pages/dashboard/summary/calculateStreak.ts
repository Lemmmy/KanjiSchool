// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { setStreak } from "@store/syncSlice.ts";

import { db } from "@db";

import { timeDay } from "d3-time";
import { map, sort, union } from "d3-array";

import { lsSetNumber } from "@utils";
import { debounce } from "lodash-es";

import Debug from "debug";
const debug = Debug("kanjischool:calculate-streak");

export interface StreakData {
  currentStreak: number;
  maxStreak: number;
  todayInStreak: boolean;
}

const STREAK_DEBOUNCE = 300;
export const calculateStreak = debounce(() => {
  _calculateStreak()
    .then(() => debug("streak updated"))
    .catch(e => {
      console.error("error updating streak", e);
    });
}, STREAK_DEBOUNCE);

async function _calculateStreak(): Promise<void> {
  const now = new Date();
  const today = timeDay.floor(now), nToday = +today;
  const yesterday = timeDay.offset(today, -1), nYesterday = +yesterday;

  // Get all reviews we have, ignore 1970 lol
  const invalid = new Date(0).toISOString();
  const reviews = await db.reviews
    .where("data_updated_at")
    .aboveOrEqual(invalid)
    .toArray();
  const lessons = await db.assignments
    .where("data.started_at")
    .aboveOrEqual(invalid)
    .toArray();

  // Get a set of dates that reviews and lessons occurred on
  const reviewDays = map(reviews,
    d => timeDay.floor(new Date(d.data_updated_at)));
  const lessonDays = map(lessons,
    d => timeDay.floor(new Date(d.data.started_at!)));
  // Combine reviews and lessons and sort by date ascending
  const days = sort(union(reviewDays, lessonDays));

  debug("got %d review and lesson days", days.length);

  let isToday = false, isYesterday = false;
  let currentStreak = 0, maxStreak = 0, todayInStreak = false;
  const streaks: number[] = [1];

  // Go through the review dates
  for (let i = 0; i < days.length; i++) {
    // Difference between this date and the next date (e.g. yesterday then today)
    const first = days[i], nFirst = +first;
    const second = days[i + 1] ?? first;
    const diff = timeDay.count(first, second);

    isToday = isToday || nFirst >= nToday; // today or future
    isYesterday = isYesterday || nFirst >= nYesterday;

    if (diff === 0) {
      if (isToday) {
        todayInStreak = true;
      }
    } else if (diff === 1) {
      ++streaks[streaks.length - 1];
    } else {
      streaks.push(1);
    }

    currentStreak = isToday || isYesterday
      ? streaks[streaks.length - 1]
      : 0;
    maxStreak = Math.max(...streaks);
  }

  lsSetNumber("currentStreak", currentStreak ?? 0);
  lsSetNumber("maxStreak", maxStreak ?? 0);
  store.dispatch(setStreak({ currentStreak, maxStreak, todayInStreak }));
}
