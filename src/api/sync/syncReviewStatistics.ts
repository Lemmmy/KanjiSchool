// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";

import * as actions from "@actions/SyncActions";

import { ApiReviewStatistic, ApiReviewStatisticMap } from "@api";
import * as api from "@api";
import { db } from "@db";

import { lsGetNumber, lsSetString, lsSetNumber } from "@utils";

import { Mutex } from "async-mutex";

import Debug from "debug";
const debug = Debug("kanjischool:api-sync-review-statistics");

export type SubjectReviewStatisticIdMap = Record<number, number>;

const syncReviewStatisticsMutex = new Mutex();
export async function syncReviewStatistics(fullSync?: boolean): Promise<void> {
  return syncReviewStatisticsMutex.runExclusive(() => _syncReviewStatistics(fullSync));
}

async function _syncReviewStatistics(fullSync?: boolean): Promise<void> {
  // Get the date of the last review statistics sync. If the stored version is
  // not the same as the current version, force a re-sync by nulling the date.
  // Also null the date if fullSync is set to true.
  if (fullSync) debug("FULL REVIEW STATISTICS SYNC");
  const syncCurrentVersion = 2;
  const syncLastVersion = lsGetNumber("syncReviewStatisticsLastVersion", 0);
  const lastSynced = syncLastVersion === syncCurrentVersion && !fullSync
    ? store.getState().sync.reviewStatisticsLastSynced
    : undefined;
  store.dispatch(actions.setSyncingReviewStatistics(true));
  debug("beginning review statistics sync since %s (ver %d -> %d)", lastSynced, syncLastVersion, syncCurrentVersion);

  await api.paginateCollection<ApiReviewStatistic>("/review_statistics", lastSynced, async ({ data }) => {
    await db.reviewStatistics.bulkPut(data);
  });

  // Re-load all the review statistics from the database (both modified and
  // unmodified) into the Redux store. Since this is a successful network sync,
  // remove any fake review statistics that were created during submission
  // (they will have negative IDs).
  debug("re-loading review statistics");
  await loadReviewStatistics(true);

  // We're now done syncing
  store.dispatch(actions.setSyncingReviewStatistics(false));

  const lastSyncedNow = new Date().toISOString();
  lsSetString("reviewStatisticsLastSynced", lastSyncedNow);
  lsSetNumber("syncReviewStatisticsLastVersion", syncCurrentVersion);
  store.dispatch(actions.setReviewStatisticsLastSynced(lastSyncedNow));
}

/** Load all the review statistics from the database into the Redux store. */
export async function loadReviewStatistics(
  removeFake?: boolean
): Promise<void> {
  debug("loading review statistics");

  // If there are no review statistics in the database, then return immediately.
  if (await db.reviewStatistics.count() === 0) {
    debug("no review statistics in the database, not loading anything");
    store.dispatch(actions.initReviewStatistics({}));
    return;
  }

  const reviewStatistics = await db.reviewStatistics.toArray();
  const reviewStatisticMap: ApiReviewStatisticMap = {};
  const removeFakeQueue: number[] = [];

  for (const r of reviewStatistics) {
    // If this is a successful network sync, remove any fake review statistics
    // that were created during submission (they will have negative IDs).
    if (removeFake && r.id < 0) {
      removeFakeQueue.push(r.id);
      continue;
    }

    reviewStatisticMap[r.id] = r;
  }

  // Delete any fake review statistics from the database now
  if (removeFake && removeFakeQueue.length > 0) {
    // TODO: should the ID counter be reset here too?
    debug("removing %d fake review statistics with negative IDs: %o",
      removeFakeQueue.length, removeFakeQueue);
    await db.reviewStatistics.bulkDelete(removeFakeQueue);
    debug("removed");
  }

  store.dispatch(actions.initReviewStatistics(reviewStatisticMap));
}
