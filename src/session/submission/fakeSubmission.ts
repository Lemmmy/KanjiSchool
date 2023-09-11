// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";

import { ApiReviewStatistic, StoredAssignment } from "@api";

import { fakeAssignmentUpdate } from "./fakeAssignmentUpdate";
import { fakeReviewStatisticUpdate } from "./fakeReviewStatisticUpdate";
import { fakeReviewUpdate } from "./fakeReviewUpdate";

// When lessons/reviews are submitted, they are placed into a queue. While the
// queue is processing, let's store 'fake' assignment in the database/Redux
// store, so the user can't accidentally perform the review twice. This should
// also make it possible to perform reviews offline eventually.
export async function fakeSubmission(
  assignment: StoredAssignment,
  oldSrsStage: number,
  newSrsStage: number,
  createdAt: Date,
  reviewStatistic?: ApiReviewStatistic,
  meaningIncorrectAnswers?: number,
  readingIncorrectAnswers?: number,
): Promise<void[]> {
  const subject = store.getState().subjects.subjects?.[assignment.data.subject_id];
  if (!subject) throw new Error("No subjects available yet!");

  return Promise.all([
    fakeAssignmentUpdate(subject, assignment, newSrsStage, createdAt),
    fakeReviewStatisticUpdate(
      assignment, createdAt, reviewStatistic,
      meaningIncorrectAnswers, readingIncorrectAnswers
    ),
    fakeReviewUpdate(
      subject, assignment, oldSrsStage, newSrsStage, createdAt,
      meaningIncorrectAnswers, readingIncorrectAnswers
    )
  ]);
}
