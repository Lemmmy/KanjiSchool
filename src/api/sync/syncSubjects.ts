// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { initSubjects } from "@store/slices/subjectsSlice.ts";
import {
  setSubjectsLastSynced,
  setSubjectsSyncedThisSession,
  setSyncingSubjects,
  setSyncingSubjectsProgress
} from "@store/slices/syncSlice.ts";

import * as api from "@api";
import { ApiSubject, NormalizedSubjectType, SubjectType } from "@api";
import { db } from "@db";
import { jishoData, KanjiJishoData } from "@data";

import { isVocabularyLike, lsGetNumber, lsSetNumber, lsSetString, normalizeVocabType } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:api-sync-subjects");

export type StoredSubject = ApiSubject & {
  data: {
    jisho?: KanjiJishoData;
  };
}
export type StoredSubjectMap = Record<number, StoredSubject>;

// Map containing each part of speech for vocabulary (used for search lookups)
export type PartsOfSpeechCache = Record<string, true>;
// Map containing the slugs -> subject IDs for each subject type
export type SlugCache = Record<NormalizedSubjectType, Record<string, number>>;

const validSubjectTypes: Record<SubjectType, true> = {
  radical:         true,
  kanji:           true,
  vocabulary:      true,
  kana_vocabulary: true
};

export async function syncSubjects(fullSync?: boolean): Promise<void> {
  // Don't sync if we're already syncing.
  const syncState = store.getState().sync;
  if (syncState.syncingSubjects) return;

  // Get the date of the last subject sync. If the stored version is not the
  // same as the current version, force a re-sync by nulling the date. Also null
  // the date if fullSync is set to true.
  if (fullSync) debug("FULL SUBJECTS SYNC");
  const syncCurrentVersion = 3;
  const syncLastVersion = lsGetNumber("syncSubjectsLastVersion", 0);
  const lastSynced = syncLastVersion === syncCurrentVersion && !fullSync
    ? syncState.subjectsLastSynced
    : undefined;
  store.dispatch(setSyncingSubjects(true));
  debug("beginning subjects sync since %s (ver %d -> %d)", lastSynced, syncLastVersion, syncCurrentVersion);

  let count = 0;
  await api.paginateCollection<ApiSubject>("/subjects", lastSynced, async ({ total_count, data }) => {
    await db.subjects.bulkPut(data.map(initSubject));

    // Update the progress bar
    count += data.length;
    store.dispatch(setSyncingSubjectsProgress({
      count, total: total_count
    }));
  });

  // We're now done syncing
  store.dispatch(setSyncingSubjects(false));
  debug("setting subjectsSyncedThisSession");
  store.dispatch(setSubjectsSyncedThisSession());

  const lastSyncedNow = new Date().toISOString();
  lsSetString("subjectsLastSynced", lastSyncedNow);
  lsSetNumber("syncSubjectsLastVersion", syncCurrentVersion);
  store.dispatch(setSubjectsLastSynced(lastSyncedNow));

  // Re-load all the subjects from the database (both modified and unmodified)
  // into the Redux store. NOTE: This has been moved to the end, to prevent
  // SyncSubjects trying to run it twice.
  debug("re-loading all subjects");
  await loadSubjects();
}

/** Load all the subjects from the database into the Redux store. Populate the
 * 'part of speech' cache and the slug cache at the same time. */
export async function loadSubjects(): Promise<void> {
  debug("loading subjects");
  /*     TIMING                                                               */ performance.mark("loadSubjects-start");

  // If there are no subjects in the database, then return immediately.
  if (await db.subjects.count() === 0) {
    debug("no subjects in the database, not loading anything");
    return;
  }

  /*     TIMING                                                               */ performance.mark("loadSubjects-toArray-start");
  const subjects = await db.subjects.toArray();
  /*     TIMING                                                               */ performance.mark("loadSubjects-toArray-end");
  /*     TIMING                                                               */ performance.measure("loadSubjects-toArray", "loadSubjects-toArray-start", "loadSubjects-toArray-end");

  const subjectMap: StoredSubjectMap = {};
  const partsOfSpeechCache: PartsOfSpeechCache = {};
  const slugCache: SlugCache = {
    radical:         {},
    kanji:           {},
    vocabulary:      {}
  };

  debug("populating StoredSubjectMap");
  /*     TIMING                                                               */ performance.mark("loadSubjects-map-start");
  for (const subject of subjects) {
    const objectType = subject.object;
    if (!validSubjectTypes[objectType]) {
      debug("encountered invalid subject type %s for subject id %d", objectType, subject.id, subject);
      continue;
    }

    subjectMap[subject.id] = subject;

    // Populate the 'parts of speech' cache.
    if (isVocabularyLike(subject) && subject.data.parts_of_speech) {
      for (const part of subject.data.parts_of_speech) {
        partsOfSpeechCache[part] = true;
      }
    }

    // Populate the slug cache.
    const normObjectType = normalizeVocabType(objectType);
    slugCache[normObjectType][subject.data.slug] = subject.id;
  }
  /*     TIMING                                                               */ performance.mark("loadSubjects-map-end");
  /*     TIMING                                                               */ performance.measure("loadSubjects-map", "loadSubjects-map-start", "loadSubjects-map-end");

  /*     TIMING                                                               */ performance.mark("loadSubjects-dispatch-start");
  store.dispatch(initSubjects({
    subjectMap, partsOfSpeechCache, slugCache
  }));
  /*     TIMING                                                               */ performance.mark("loadSubjects-dispatch-end");
  /*     TIMING                                                               */ performance.measure("loadSubjects-dispatch", "loadSubjects-dispatch-start", "loadSubjects-dispatch-end");

  /*     TIMING                                                               */ performance.mark("loadSubjects-end");
  /*     TIMING                                                               */ performance.measure("loadSubjects", "loadSubjects-start", "loadSubjects-end");
}

export function initSubject(
  subject: ApiSubject
): StoredSubject {
  const chars = subject.data.characters;

  // Add information from Jisho if this is a kanji and it is available
  let kanjiJishoData: KanjiJishoData | undefined;
  if (chars && subject.object === "kanji" && jishoData[chars]) {
    const [joyo, jlpt, nfr, stroke] = jishoData[chars];
    kanjiJishoData = { joyo, jlpt, nfr, stroke };
  }

  const newSubj = subject as StoredSubject;
  if (kanjiJishoData) newSubj.data.jisho = kanjiJishoData;
  return newSubj;
}
