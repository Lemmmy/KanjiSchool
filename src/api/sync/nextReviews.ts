// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";
import * as actions from "@actions/SyncActions";

import { StoredAssignmentMap, AssignmentSubjectId, StoredSubjectMap } from "@api";

import { lsSetObject, lsSetString, lsSetBoolean, lsSetNumber } from "@utils";
import dayjs, { Dayjs } from "dayjs";

export interface NextReviewsAvailable {
  checkTime: string | null;
  nextReviewsAt: string | null;
  nextReviewsNow: boolean;
  nextReviewsCount: number;
  nextReviewsWeek: number;
}

export function calculateNextReviews(
  subjects: StoredSubjectMap,
  assignments: StoredAssignmentMap,
  maxLevel: number
): void {
  const now = dayjs();
  const week = dayjs().add(7, "day");

  const pendingLessons: AssignmentSubjectId[] = [];
  const pendingReviews: AssignmentSubjectId[] = [];
  let nextReviewsAtRaw: string | undefined;
  let nextReviewsAt: Dayjs | undefined;
  let nextReviewsNow = false;
  let nextReviewsCount = 0;
  let nextReviewsWeek = 0;

  for (const assignmentId in assignments) {
    const assignment = assignments[assignmentId];
    const { internalShouldShow, srs_stage, available_at } = assignment.data;
    if (!internalShouldShow) continue;

    // If on a free subscription, remove subjects outside of max level
    const subject = subjects[assignment.data.subject_id];
    if (subject.data.level > maxLevel) continue;

    const srsStage = srs_stage;
    if (srsStage === 0) { // If SRS stage is 0, then this is a lesson
      pendingLessons.push([assignment.id, assignment.data.subject_id]);
    } else if (srsStage !== 9 && available_at && now.isSameOrAfter(available_at)) {
      pendingReviews.push([assignment.id, assignment.data.subject_id]);
    }

    // Calculate the 'next reviews at'
    if (srsStage !== 0 && srsStage !== 9 && available_at) {
      const availableNow = now.isSameOrAfter(available_at);

      // If this is within the next week, and is not available now, add to the
      // 7d upcoming counter:
      if (!availableNow && week.isSameOrAfter(available_at)) {
        nextReviewsWeek++;
      }

      if (availableNow) {
        // If this review is available now, reset the next review stats and
        // start counting again:
        if (!nextReviewsNow) {
          nextReviewsNow = true;
          nextReviewsCount = 1;
          nextReviewsAtRaw = available_at;
          nextReviewsAt = dayjs(available_at);
        } else {
          nextReviewsCount++;
        }
      } else if (!nextReviewsAt || nextReviewsAt.isAfter(available_at)) {
        // If this review is earlier than our current known earliest one, reset
        // too:
        nextReviewsCount = 1;
        nextReviewsAtRaw = available_at;
        nextReviewsAt = dayjs(available_at);
      } else if (nextReviewsAtRaw === available_at) {
        // Otherwise, if this is the same as our current time bucket, just
        // increment the count:
        nextReviewsCount++;
      }
    }
  }

  store.dispatch(actions.setPendingLessons(pendingLessons));
  lsSetObject("pendingLessons2", pendingLessons);
  store.dispatch(actions.setPendingReviews(pendingReviews));
  lsSetObject("pendingReviews2", pendingReviews);

  store.dispatch(actions.setNextReviewsAvailable({
    checkTime: now.toISOString(),
    nextReviewsAt: nextReviewsAtRaw || null,
    nextReviewsNow,
    nextReviewsCount,
    nextReviewsWeek,
  }));
  lsSetString("nextReviewsCheckTime", now.toISOString());
  lsSetString("nextReviewsAt", nextReviewsAtRaw || null);
  lsSetBoolean("nextReviewsNow", nextReviewsNow);
  lsSetNumber("nextReviewsCount", nextReviewsCount);
  lsSetNumber("nextReviewsWeek", nextReviewsWeek);
}
