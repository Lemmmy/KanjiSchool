// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";

import * as actions from "@actions/SyncActions";

import { ApiLevelProgression, ApiLevelProgressionMap } from "@api";
import * as api from "@api";
import { db } from "@db";

import { lsGetNumber, lsSetString, lsSetNumber } from "@utils";

import { Mutex } from "async-mutex";

import Debug from "debug";
const debug = Debug("kanjischool:api-sync-level-progressions");

const syncLevelProgressionsMutex = new Mutex();
export async function syncLevelProgressions(fullSync?: boolean): Promise<void> {
  return syncLevelProgressionsMutex.runExclusive(() => _syncLevelProgressions(fullSync));
}

async function _syncLevelProgressions(fullSync?: boolean): Promise<void> {
  // Get the date of the last level progressions sync. If the stored version is
  // not the same as the current version, force a re-sync by nulling the date.
  // Also null the date if fullSync is set to true.
  if (fullSync) debug("FULL LEVEL PROGRESSIONS SYNC");
  const syncCurrentVersion = 2;
  const syncLastVersion = lsGetNumber("syncLevelProgressionsLastVersion", 0);
  const lastSynced = syncLastVersion === syncCurrentVersion && !fullSync
    ? store.getState().sync.levelProgressionsLastSynced
    : undefined;
  store.dispatch(actions.setSyncingLevelProgressions(true));
  debug("beginning level progressions sync since %s (ver %d -> %d)", lastSynced, syncLastVersion, syncCurrentVersion);

  await api.paginateCollection<ApiLevelProgression>("/level_progressions", lastSynced, async ({ data }) => {
    await db.levelProgressions.bulkPut(data);
  });

  // Re-load all the level progressions from the database (both modified and
  // unmodified) into the Redux store.
  debug("re-loading level progressions");
  await loadLevelProgressions();

  // We're now done syncing
  store.dispatch(actions.setSyncingLevelProgressions(false));

  const lastSyncedNow = new Date().toISOString();
  lsSetString("levelProgressionsLastSynced", lastSyncedNow);
  lsSetNumber("syncLevelProgressionsLastVersion", syncCurrentVersion);
  store.dispatch(actions.setLevelProgressionsLastSynced(lastSyncedNow));
}

/** Load all the level progressions from the database into the Redux store. */
export async function loadLevelProgressions(): Promise<void> {
  debug("loading level progressions");

  // If there are no level progressions, then return immediately
  if (await db.levelProgressions.count() === 0) {
    debug("no level progressions in the database, not loading anything");
    store.dispatch(actions.initLevelProgressions({}));
    return;
  }

  const levelProgressions = await db.levelProgressions.toArray();
  const levelProgressionMap: ApiLevelProgressionMap = {};
  for (const r of levelProgressions) { levelProgressionMap[r.id] = r; }

  store.dispatch(actions.initLevelProgressions(levelProgressionMap));
}
