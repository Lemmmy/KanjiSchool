// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";

import * as actions from "@actions/SyncActions";

import * as api from "@api";
import { ApiReview } from "@api";
import { db } from "@db";

import { Mutex } from "async-mutex";

import { lsGetNumber, lsSetNumber, lsSetString } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:api-sync-reviews");

const syncReviewsMutex = new Mutex();
export async function syncReviews(fullSync?: boolean): Promise<void> {
  return syncReviewsMutex.runExclusive(() => _syncReviews(fullSync));
}

async function _syncReviews(fullSync?: boolean): Promise<void> {
  // Get the date of the last reviews sync. If the stored version is not the
  // same as the current version, force a re-sync by nulling the date. Also null
  // the date if fullSync is set to true.
  if (fullSync) debug("FULL REVIEWS SYNC");
  const syncCurrentVersion = 1;
  const syncLastVersion = lsGetNumber("syncReviewsLastVersion", 0);
  const lastSynced = syncLastVersion === syncCurrentVersion && !fullSync
    ? store.getState().sync.reviewsLastSynced
    : undefined;
  store.dispatch(actions.setSyncingReviews(true));
  debug("beginning reviews sync since %s (ver %d -> %d)", lastSynced, syncLastVersion, syncCurrentVersion);

  let count = 0;
  await api.paginateCollection<ApiReview>("/reviews", lastSynced, async ({ total_count, data }) => {
    await db.reviews.bulkPut(data);

    // Update the progress bar
    count += data.length;
    store.dispatch(actions.setSyncingReviewsProgress({
      count, total: total_count
    }));
  });

  // Remove any fake reviews from the database that were created during
  // submission (they will have negative IDs).
  debug("removing fake reviews");
  const fakeReviews = await db.reviews
    .where("id")
    .below(0)
    .delete();
  debug("removed %d fake reviews", fakeReviews);

  // We're now done syncing
  store.dispatch(actions.setSyncingReviews(false));

  const lastSyncedNow = new Date().toISOString();
  lsSetString("reviewsLastSynced", lastSyncedNow);
  lsSetNumber("syncReviewsLastVersion", syncCurrentVersion);
  store.dispatch(actions.setReviewsLastSynced(lastSyncedNow));
}
