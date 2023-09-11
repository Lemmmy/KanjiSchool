// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { updateAssignment } from "@store/slices/assignmentsSlice.ts";
import { updateReviewStatistic } from "@store/slices/reviewStatisticsSlice.ts";
import { batch } from "react-redux";
import { Action } from "redux";

import * as api from "@api";
import { ApiCreateReviewResponse } from "@api";
import { db } from "@db";

import { isRecentTime } from "@utils/isRecentTime";

import Debug from "debug";
const debug = Debug("kanjischool:api-reviews");

export async function createReview(
  assignmentId: number,
  incorrectMeaningAnswers: number,
  incorrectReadingAnswers: number,
  createdAt: Date | null
): Promise<ApiCreateReviewResponse> {
  const res = await api.post<ApiCreateReviewResponse>("/reviews", {
    review: {
      assignment_id: assignmentId,
      incorrect_meaning_answers: incorrectMeaningAnswers,
      incorrect_reading_answers: incorrectReadingAnswers,
      created_at: isRecentTime(createdAt) ? undefined : createdAt?.toISOString()
    }
  });

  // Separate the resources_updated from the rest of the new review
  const { resources_updated, ...review } = res;
  const dispatches: Action[] = [];

  // Insert the new review (without resources_updated) into the database
  debug("createReview inserting review %d", review.id);
  await db.reviews.put(review);

  // Update the assignment in Redux and the db
  const assignment = api.initAssignment(resources_updated.assignment);
  debug("createReview inserting assignment %d", assignment.id);
  await db.assignments.put(assignment);
  dispatches.push(updateAssignment(assignment));

  // Update the review statistic (if it's available) in Redux and the db
  const reviewStatistic = resources_updated.review_statistic;
  if (reviewStatistic) {
    debug("createReview inserting review statistic %d", reviewStatistic.id);
    await db.reviewStatistics.put(reviewStatistic);
    dispatches.push(updateReviewStatistic(reviewStatistic));
  }

  // Perform all the dispatches simultaneously
  batch(() => dispatches.forEach(store.dispatch));

  return res;
}
