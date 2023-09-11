// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";

import { SubjectWithAssignment } from "@api";

import { SessionType } from "./";
import {
  getLessonSessionOrderOptions, getReviewSessionOrderOptions,
  getSelfStudySessionOrderOptions, LessonOpts, ReviewOpts, SessionOpts
} from "./order/options";
import { LESSON_ORDERS } from "./order/LessonOrder";
import { buildSessionComparator } from "./order/sessionOrder";

import { SubjectComparator } from "@utils/comparator";

import { globalNotification } from "@global/AntInterface.tsx";

import { sortBy, shuffle } from "lodash-es";

import Debug from "debug";
const debug = Debug("kanjischool:session-pick");

export type SessionPickResult = [
  SubjectWithAssignment[],
  SessionOpts, // These are the options used, which may be passed through
  SubjectComparator,
];

export function pickSessionItems(
  type: SessionType,
  options?: Partial<LessonOpts | ReviewOpts>,
  candidateSubjectIds?: number[]
): SessionPickResult | false {
  try {
    switch (type) {
    case "lesson":
      return pickLessonItems(options as Partial<LessonOpts>);
    case "review":
      return pickReviewItems(options as Partial<ReviewOpts>);
    case "self_study":
      return pickSelfStudyItems(options as Partial<ReviewOpts>, candidateSubjectIds);
    }
  } catch (e: any) {
    debug("error picking session items", e);
    debug("context:", type, options, candidateSubjectIds);
    console.error(e, { contexts: { session: {
      type,
      options: JSON.stringify(options)
    }}});
    globalNotification.error({ message: "There was an error picking subject items. See console for details." });
    return false;
  }
}

/**
 * Pick a group of subjects from the given subject IDs (sourced from
 * pendingLessons, pendingReviews, or a self-study search), according to the
 * ordering options. Returns the subjects and assignments (if available).
 */
export function pickSubjects(
  type: SessionType,
  subjectIds: number[],
  opts: SessionOpts
): SessionPickResult {
  debug("picking %s session subjects from a pool of %d using options:", type, subjectIds.length);
  for (const opt in opts) debug("[%s]: %o", opt, (opts as any)[opt]);

  const { subjects } = store.getState().subjects;
  const { assignments, subjectAssignmentIdMap } = store.getState().assignments;
  const { user } = store.getState().auth;
  if (!assignments) throw new Error("No assignments available yet!");
  if (!subjects) throw new Error("No subjects available yet!");
  if (!user) throw new Error("No user available yet!");

  const comparator = buildSessionComparator(type, opts);

  // Whether the subject list should be shuffled prior to applying the
  // ordering rules
  const shouldShuffle = type !== "lesson"
    || LESSON_ORDERS[(opts as LessonOpts).order].shuffle;

  // Clone the subject ID list, shuffling it if necessary, then convert to
  // SubjectWithOptAssignment
  let list: SubjectWithAssignment[] =
    (shouldShuffle ? shuffle(subjectIds) : subjectIds)
      .map(id => [subjects[id], assignments[subjectAssignmentIdMap[id]]]);

  // If on a free subscription, remove subjects outside of max level
  const maxLevel = user.data.subscription.max_level_granted;
  list = list.filter(([s]) => s.data.level <= maxLevel);

  list.sort(comparator); // Main sort using our new comparator
  // TODO: This slicing step actually has a lot more logic to it in FD:
  if (!opts.all) // Assuming we don't want all items in the session,
    list = list.slice(0, opts.maxSize || 10); // Select the first n

  return [list, opts, comparator];
}

const mergeOptions = <T extends SessionOpts>(
  baseOpts: T,
  options?: Partial<T>
): T =>
    Object.assign({}, baseOpts, options);

function pickLessonItems(
  options?: Partial<LessonOpts>
): SessionPickResult {
  const { subjects } = store.getState().subjects;
  const { pendingLessons } = store.getState().reviews;
  if (!subjects) throw new Error("No subjects available yet!");
  if (!pendingLessons) throw new Error("No pendingLessons available yet!");

  // Pre-sort by lesson position before passing to the user-defined ordering
  const lessonSubjectIds = pendingLessons.map(l => l[1]);
  debug("picking lesson items from %d pending lessons", lessonSubjectIds.length, pendingLessons);
  const sortedLessons = sortBy(lessonSubjectIds, [
    l => subjects[l].data.level,
    l => subjects[l].data.lesson_position,
    l => l
  ]);

  const mergedOpts = mergeOptions(getLessonSessionOrderOptions(), options);
  return pickSubjects("lesson", sortedLessons, mergedOpts);
}

function pickReviewItems(
  options?: Partial<ReviewOpts>
): SessionPickResult {
  const { pendingReviews } = store.getState().reviews;
  if (!pendingReviews) throw new Error("No pendingReviews available yet!");

  const reviewSubjectIds = pendingReviews.map(r => r[1]);

  const mergedOpts = mergeOptions(getReviewSessionOrderOptions(), options);
  return pickSubjects("review", reviewSubjectIds, mergedOpts);
}

function pickSelfStudyItems(
  options?: Partial<ReviewOpts>,
  candidateSubjectIds?: number[]
): SessionPickResult {
  if (!candidateSubjectIds) throw new Error("No subject ids provided!");

  const mergedOpts = mergeOptions(getSelfStudySessionOrderOptions(), options);
  return pickSubjects("self_study", candidateSubjectIds, mergedOpts);
}
