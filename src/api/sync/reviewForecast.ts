// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { StoredAssignmentMap, StoredSubjectMap } from "@api";
import { getSrsReviewBucketName, normalizeVocabType } from "@utils";

import dayjs from "dayjs";

export type Bucket = Record<string, number>;

export interface ReviewForecast {
  // SRS stage buckets
  apprentice: Bucket;
  guru: Bucket;
  master: Bucket;
  enlightened: Bucket;

  /** Not current-level radical/kanji **/
  nonLevelUp: Bucket;
  /** Current-level radical/kanji **/
  levelUp: Bucket;

  // Subject type buckets
  radical: Bucket;
  kanji: Bucket;
  vocabulary: Bucket;

  total: Bucket;
  cum: Bucket;

  // Used to generate the chart's data points in the correct order
  sortedDates: string[];

  // The current hour string
  now: string;
}

function addToBucket(date: string, bucket: Bucket): void {
  bucket[date] = (bucket[date] || 0) + 1;
}

/**
 * Go through the next 8 days of assignments, counting them into hourly buckets
 * for each SRS stage, as well as a total bucket and a cumulative bucket.
 *
 * The reason for defaulting to 8 days instead of 7 is to ensure that all full
 * calendar dates are covered, for the review forecast card specifically, rather
 * than the summary chart.
 */
export function generateReviewForecast(
  userLevel: number,
  includeNow: boolean,
  subjects: StoredSubjectMap,
  assignments: StoredAssignmentMap
): ReviewForecast {
  const maxDays = 8;

  const now = dayjs().startOf("hour");
  const nowStr = now.toISOString();
  const inMax = dayjs().add(maxDays, "day").startOf("hour");
  const inMaxStr = inMax.toISOString();

  // Initialise the buckets to prepare the data into
  const buckets: ReviewForecast = {
    // SRS stage buckets
    apprentice: {}, guru: {}, master: {}, enlightened: {},
    // Level-up/non-level up
    nonLevelUp: {}, levelUp: {},
    // Subject type buckets
    radical: {}, kanji: {}, vocabulary: {},

    total: {}, cum: {},
    sortedDates: [],

    now: nowStr
  };
  const cumBucket = buckets.cum;
  const totalBucket = buckets.total;

  // Go through the assignments and bucket them by their hour, ignoring any
  // after max days
  for (const assignmentId in assignments) {
    // -------------------------------------------------------------------------
    // Filtering
    // -------------------------------------------------------------------------
    // Ignore invalid assignments
    const assignment = assignments[assignmentId];
    if (assignment.data.hidden
      || !assignment.data.internalShouldShow
      || !assignment.data.available_at) continue;

    // Ignore any outside of the 1-8 (inclusive) SRS range
    const stage = assignment.data.srs_stage;
    if (stage < 1 || stage > 8) continue;

    // Ignore invalid subjects
    const subject = subjects[assignment.data.subject_id];
    if (!subject || subject.data.hidden_at) continue;

    // Ignore assignments that aren't due within the next 7 days
    const date = dayjs(assignment.data.available_at).startOf("hour");
    if (date.isAfter(inMax)) continue;
    const dateStr = date.toISOString();

    // -------------------------------------------------------------------------
    // Bucketing
    // -------------------------------------------------------------------------
    // If the assignment is due now (in or before the current hour), add it to
    // the 'now' buckets, otherwise add it to its hour buckets. If includeNow is
    // false then ignore dates before the current hour.
    if (!includeNow && date.isBefore(now)) continue;
    const bucketDate = now.isSameOrAfter(date) ? nowStr : dateStr;

    const add = addToBucket.bind(addToBucket, bucketDate);

    // If the subject is a current-level radical or kanji, and it has not yet
    // been passed before, it is considered here as a level-up kanji. Note that
    // this technically differs to the session comparator's definition of a
    // "level-up track subject", which accounts for component subjects too.
    const isLevelUp = subject.data.level === userLevel
      && subject.object !== "vocabulary"
      && subject.object !== "kana_vocabulary"
    && !assignment.data.passed_at;

    // Insert into the SRS stage bucket
    add(buckets[getSrsReviewBucketName(stage)]);
    // Insert into the level-up/non-level-up bucket
    add(isLevelUp ? buckets.levelUp : buckets.nonLevelUp);
    // Insert into the subject type bucket
    add(buckets[normalizeVocabType(subject.object)]);

    // Add to the cum bucket
    add(cumBucket);
  }

  // Add the start date to the cum bucket if it is not already present
  if (!cumBucket[nowStr]) cumBucket[nowStr] = 0;

  // Sort the dates from the cum bucket
  const sortedDates = Object.keys(cumBucket);
  sortedDates.sort();

  // Calculate the cum bucket
  let cum = 0;
  for (const date of sortedDates) {
    // Before actually accumulating the data and replacing it in cumBucket,
    // add the data to the totalBucket (since at this point, they are identical)
    totalBucket[date] = cumBucket[date];

    // Add the cum to our cum counter and put it in the cum bucket
    cum += cumBucket[date];
    cumBucket[date] = cum;
  }

  // Add the end date to the cum bucket if it is not already present
  if (!cumBucket[inMaxStr]) {
    cumBucket[inMaxStr] = cum;
    sortedDates.push(inMaxStr);
  }

  buckets.sortedDates = sortedDates;
  return buckets;
}
