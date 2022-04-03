// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { StoredSubject, StoredAssignment, ApiReview } from "@api";
import { db } from "@db";

import { lsGetThenDecr } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:session-submission");

export async function fakeReviewUpdate(
  subject: StoredSubject,
  assignment: StoredAssignment,
  oldSrsStage: number,
  newSrsStage: number,
  createdAt: Date,
  meaningIncorrectAnswers?: number,
  readingIncorrectAnswers?: number
): Promise<void> {
  // If meaningIncorrectAnswers is undefined, that means this was probably a
  // lesson submission; lessons do not spawn reviews since they do not track
  // incorrect answers.
  if (meaningIncorrectAnswers === undefined)
    return;

  // Generate a fake ID for this new review. Fake IDs are always negative and
  // will start at -1, to distinguish them from real server IDs.
  const newId = lsGetThenDecr("fakeReviewId");
  debug("assigned fake ID %d for new reviews", newId);

  const review: ApiReview = {
    id: newId,
    object: "review",
    url: "http://pending.invalid/reviews/" + newId,
    data_updated_at: createdAt.toISOString(),
    data: {
      created_at: createdAt.toISOString(),
      assignment_id: assignment.id,
      subject_id: subject.id,
      spaced_repetition_system_id: subject.data.spaced_repetition_system_id,
      starting_srs_stage: oldSrsStage,
      ending_srs_stage: newSrsStage,
      incorrect_meaning_answers: meaningIncorrectAnswers ?? 0,
      incorrect_reading_answers: readingIncorrectAnswers ?? 0
    }
  };

  // Store the new fake review in the db
  debug("storing fake review %d: %o", review.id, review);
  db.reviews.put(review);
}
