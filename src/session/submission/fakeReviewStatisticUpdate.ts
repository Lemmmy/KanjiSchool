// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { updateReviewStatistic } from "@store/slices/reviewStatisticsSlice.ts";

import { ApiReviewStatistic, ApiReviewStatisticInner, StoredAssignment } from "@api";
import { db } from "@db";

import { lsGetThenDecr } from "@utils";

import Debug from "debug";

const debug = Debug("kanjischool:session-submission");

export async function fakeReviewStatisticUpdate(
  assignment: StoredAssignment,
  createdAt: Date,
  rs?: ApiReviewStatistic,
  meaningIncorrectAnswers?: number,
  readingIncorrectAnswers?: number
): Promise<void> {
  // If meaningIncorrectAnswers is undefined, that means this was probably a
  // lesson submission; lessons do not spawn review statistics since they do not
  // track incorrect answers.
  if (meaningIncorrectAnswers === undefined)
    return;

  // Create a blank review statistic if there isn't already one defined,
  // otherwise clone the old one.
  if (!rs) {
    // Generate a fake ID for this new review statistic. Fake IDs are always
    // negative and will start at -1, to distinguish them from real server IDs.
    const newId = lsGetThenDecr("fakeReviewStatisticId");
    debug("assigned fake ID %d for new review statistic", newId);

    rs = {
      id: newId,
      object: "review_statistic",
      url: "http://pending.invalid/review_statistic/" + newId,
      data_updated_at: createdAt.toISOString(),
      data: {
        created_at: createdAt.toISOString(),
        hidden: false,
        meaning_correct: 0, meaning_incorrect: 0,
        meaning_current_streak: 0, meaning_max_streak: 0,
        reading_correct: 0, reading_incorrect: 0,
        reading_current_streak: 0, reading_max_streak: 0,
        percentage_correct: 0,
        subject_id: assignment.data.subject_id,
        subject_type: assignment.data.subject_type,
      }
    };
  } else {
    // Clone the old review statistic
    // rs = {
    //   ...rs,
    //   data_updated_at: createdAt.toISOString(),
    //   data: { ...rs.data }
    // };
  }

  const d: ApiReviewStatisticInner = { ...rs.data };

  // Increment the relevant values. To finish a review, we'd have gotten all the
  // answers correct at least once, and incorrect 0 or more times.
  d.meaning_correct += 1;
  d.meaning_incorrect += meaningIncorrectAnswers;
  d.reading_correct += 1;
  d.reading_incorrect += (readingIncorrectAnswers ?? 0);

  // Update the percentage correct according to the formula from the WK docs.
  d.percentage_correct = Math.floor((100 * (d.meaning_correct + d.reading_correct)) /
    (d.meaning_incorrect + d.reading_incorrect +
      d.meaning_correct + d.reading_correct));

  // If there were no incorrect answers, raise the streak by one, and set the
  // max streak to max(oldMax, currentStreak).
  if (meaningIncorrectAnswers === 0) {
    d.meaning_current_streak += 1;
    d.meaning_max_streak = Math.max(d.meaning_current_streak, d.meaning_max_streak);
  } else {
    // We had incorrect answers, start the current streak back at 1
    d.meaning_current_streak = 1;
  }

  // Same for reading streaks
  if (readingIncorrectAnswers === 0) {
    d.reading_current_streak += 1;
    d.reading_max_streak = Math.max(d.reading_current_streak, d.reading_max_streak);
  } else {
    d.reading_current_streak = 1;
  }

  // Store the new fake review statistic everywhere
  debug("storing fake review statistic %d: %o", rs.id, rs);

  // Store it everywhere
  db.reviewStatistics.put(rs);
  store.dispatch(updateReviewStatistic(rs));
}
