// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";

import * as actions from "@actions/SyncActions";

import * as api from "@api";
import {
  ApiAssignment, StoredSubject, StoredSubjectMap,
  calculateNextReviews, generateReviewForecast
} from "@api";
import { db } from "@db";

import {
  lsGetNumber, lsSetString, lsSetNumber, shouldShowSubject
} from "@utils";

import { Mutex } from "async-mutex";

import Debug from "debug";
const debug = Debug("kanjischool:api-sync-assignments");

export type StoredAssignment = ApiAssignment & {
  data: {
    internalShouldShow: boolean;
  };
}
export type StoredAssignmentMap = Record<number, StoredAssignment>;

export type AssignmentWithSubject = StoredAssignment & {
  subject: StoredSubject;
}
export type AssignmentSubjectId = [number, number];
export type SubjectWithAssignment = [StoredSubject, StoredAssignment | undefined];
export type SubjectAssignmentIdMap = Record<number, number>;

const syncAssignmentsMutex = new Mutex();
export async function syncAssignments(
  fullSync?: boolean,
  since?: string
): Promise<void> {
  // When opening the page to the dashboard, the assignments could get loaded
  // twice. This sloppily prevents a data race during that.
  return syncAssignmentsMutex.runExclusive(() =>
    _syncAssignments(fullSync, since));
}

async function _syncAssignments(
  fullSync?: boolean,
  since?: string
): Promise<void> {
  // Get the date of the last assignment sync. If the stored version is not the
  // same as the current version, force a re-sync by nulling the date. Also null
  // the date if fullSync is set to true.
  if (fullSync) debug("FULL ASSIGNMENTS SYNC");
  if (since) debug("ASSIGNMENTS SYNC SINCE %s", since);
  const syncCurrentVersion = 4;
  const syncLastVersion = lsGetNumber("syncAssignmentsLastVersion", 0);
  const lastSynced = syncLastVersion === syncCurrentVersion && !fullSync
    ? (since ?? store.getState().sync.assignmentsLastSynced)
    : undefined;
  store.dispatch(actions.setSyncingAssignments(true));
  debug("beginning assignments sync since %s (ver %d -> %d)", lastSynced, syncLastVersion, syncCurrentVersion);

  // Get the last known total from local storage to estimate the progress bar
  // size. If there is none, or we are not doing a full sync, assume a total of
  // 1 for now.
  const knownTotal = fullSync ? lsGetNumber("syncAssignmentsLastTotal", 1) : 1;
  debug("syncAssignments last known total is %d", knownTotal);

  // Start the progress bar.
  let count = 0;
  store.dispatch(actions.setSyncingAssignmentsProgress({
    count: -1, total: Math.max(knownTotal ?? 1, 1)
  }));

  // Attempt to get the user's current level from what's already saved.
  const cachedUserLevel = store.getState().auth.user?.data?.level ?? undefined;
  let userLevel = cachedUserLevel;

  // If there's no level, or this is a full sync, forcibly fetch it again
  if (!cachedUserLevel || fullSync) {
    debug("syncAssignments fetching user (cached: %d)", cachedUserLevel);
    const user = await api.syncUser();
    if (!user) throw new Error("No user!");
    userLevel = user.data.level;
  }

  // The subject map, for checking if assignments should be hidden
  const subjects = store.getState().sync.subjects;
  if (!subjects) throw new Error("no subjects!");

  await api.paginateCollection<ApiAssignment>("/assignments", lastSynced, async ({ total_count, data }) => {
    // Update the known last total for progress bar estimation (full sync only)
    if (fullSync && total_count !== knownTotal) {
      debug("syncAssignments setting last known total to %d", total_count);
      lsSetNumber("syncAssignmentsLastTotal", total_count);
    }

    const assignments = data.map(a => initAssignment(a, userLevel, subjects));
    await db.assignments.bulkPut(assignments);

    // Update the progress bar
    count += assignments.length;
    store.dispatch(actions.setSyncingAssignmentsProgress({
      count, total: total_count
    }));
  });

  // Re-load all the assignments from the database (both modified and
  // unmodified) into the Redux store.
  debug("re-loading all assignments");
  await loadAssignments();

  // We're now done syncing
  store.dispatch(actions.setSyncingAssignments(false));

  const lastSyncedNow = new Date().toISOString();
  lsSetString("assignmentsLastSynced", lastSyncedNow);
  lsSetNumber("syncAssignmentsLastVersion", syncCurrentVersion);
  store.dispatch(actions.setAssignmentsLastSynced(lastSyncedNow));
}

/** Load all the assignments from the database into the Redux store. */
export async function loadAssignments(): Promise<void> {
  debug("loading assignments");

  // If there are no assignments in the database, then return immediately.
  if (await db.assignments.count() === 0) {
    debug("no assignments in the database, not loading anything");
    return;
  }

  // User level and subjects are required for loading assignments.
  const userLevel = store.getState().auth.user?.data.level;
  if (!userLevel) throw new Error("No user level!");
  const subjects = store.getState().sync.subjects;
  if (!subjects) throw new Error("No subjects!");

  const assignments = await db.assignments.toArray();
  const assignmentMap: StoredAssignmentMap = {};
  for (const a of assignments) { assignmentMap[a.id] = a; }

  store.dispatch(actions.initAssignments(assignmentMap));

  // Re-calculate the next reviews and review forecast
  reloadAssignments();
}

export function reloadAssignments(): void {
  const userLevel = store.getState().auth.user?.data.level;
  const maxLevel = store.getState().auth.user?.data.subscription.max_level_granted || 3;
  const { subjects, assignments } = store.getState().sync;
  if (!userLevel || !subjects || !assignments) return;

  debug("reloading assignments next reviews & review forecast");

  // Calculate the amount of lessons and reviews that are currently available
  calculateNextReviews(subjects, assignments, maxLevel);

  // Calculate the 7-day review forecast
  const forecast = generateReviewForecast(userLevel, subjects, assignments);
  store.dispatch(actions.setReviewForecast(forecast));
}

export function initAssignment(
  assignment: ApiAssignment,
  userLevel?: number,
  subjects?: StoredSubjectMap
): StoredAssignment {
  const { subject_id } = assignment.data;

  if (!userLevel) userLevel = store.getState().auth.user?.data.level;
  if (!userLevel) throw new Error("No user level!");

  if (!subjects) subjects = store.getState().sync.subjects;
  if (!subjects) throw new Error("No subjects!");

  // For all assignments, ignore based on level/hidden
  const newAss = assignment as StoredAssignment;
  newAss.data.internalShouldShow = shouldShowSubject(userLevel, subjects, subject_id);
  return newAss;
}
