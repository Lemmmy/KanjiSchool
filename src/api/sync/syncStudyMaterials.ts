// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";

import * as actions from "@actions/SyncActions";

import { ApiStudyMaterial, ApiStudyMaterialMap } from "@api";
import * as api from "@api";
import { db } from "@db";

import { lsGetNumber, lsSetString, lsSetNumber } from "@utils";

import { Mutex } from "async-mutex";

import Debug from "debug";
const debug = Debug("kanjischool:api-sync-study-materials");

export type SubjectStudyMaterialIdMap = Record<number, number>;

const syncStudyMaterialsMutex = new Mutex();
export async function syncStudyMaterials(fullSync?: boolean): Promise<void> {
  return syncStudyMaterialsMutex.runExclusive(() => _syncStudyMaterials(fullSync));
}

async function _syncStudyMaterials(fullSync?: boolean): Promise<void> {
  // Get the date of the last study materials sync. If the stored version is
  // not the same as the current version, force a re-sync by nulling the date.
  // Also null the date if fullSync is set to true.
  if (fullSync) debug("FULL STUDY MATERIALS SYNC");
  const syncCurrentVersion = 1;
  const syncLastVersion = lsGetNumber("syncStudyMaterialsLastVersion", 0);
  const lastSynced = syncLastVersion === syncCurrentVersion && !fullSync
    ? store.getState().sync.studyMaterialsLastSynced
    : undefined;
  store.dispatch(actions.setSyncingStudyMaterials(true));
  debug("beginning study materials sync since %s (ver %d -> %d)", lastSynced, syncLastVersion, syncCurrentVersion);

  await api.paginateCollection<ApiStudyMaterial>("/study_materials", lastSynced, async ({ data }) => {
    await db.studyMaterials.bulkPut(data);
  });

  // Re-load all the study materials from the database (both modified and
  // unmodified) into the Redux store.
  debug("re-loading study materials");
  await loadStudyMaterials();

  // We're now done syncing
  store.dispatch(actions.setSyncingStudyMaterials(false));

  const lastSyncedNow = new Date().toISOString();
  lsSetString("studyMaterialsLastSynced", lastSyncedNow);
  lsSetNumber("syncStudyMaterialsLastVersion", syncCurrentVersion);
  store.dispatch(actions.setStudyMaterialsLastSynced(lastSyncedNow));
}

/** Load all the study materials from the database into the Redux store. */
export async function loadStudyMaterials(): Promise<void> {
  debug("loading study materials");

  // If there are no study materials, then return immediately
  if (await db.studyMaterials.count() === 0) {
    debug("no study materials in the database, not loading anything");
    store.dispatch(actions.initStudyMaterials({}));
    return;
  }

  const studyMaterials = await db.studyMaterials.toArray();
  const studyMaterialMap: ApiStudyMaterialMap = {};
  for (const r of studyMaterials) { studyMaterialMap[r.id] = r; }

  store.dispatch(actions.initStudyMaterials(studyMaterialMap));
}
