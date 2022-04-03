// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { notification } from "antd";

import { initDatabase } from "@db";
import * as api from "@api";

import { lsGetBoolean, lsGetString, getOnlineStatus } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:api-load-all");

const time = (start: Date, name: string) =>
  debug("%s: %d ms", name, (new Date().getTime()) - start.getTime());

/**
 * Initializes the database (which runs any necessary migrations), then loads it
 * all, starting with the subjects first, and then everything else in parallel.
 * This ensures that there is at least some information available in case the
 * application is running offline.
 *
 * This function is responsible for loading:
 * - Subjects
 * - Assignments
 * - Review statistics
 * - Level progressions
 * - Study materials
 *
 * Note that audio and images are not managed here, because they don't actually
 * load data directly into Redux on startup.
 */
export async function initDbAndLoadAll(): Promise<void> {
  /*     TIMING                                                               */ const start = new Date();
  /*     TIMING                                                               */ const t = time.bind(time, start);

  debug("init - initDatabase start");
  await initDatabase();
  /*     TIMING                                                               */ t("init - initDatabase end");

  // Now that the database is initialized, check if clearingData is set. If the
  // page disappears while in the middle of logging out, some dirty data would
  // still be left behind, so we clear it up here by attempting to log out
  // again.
  if (lsGetBoolean("clearingData")) {
    debug("init - clearingData is set, attempting logOut again");
    await api.logOut();
    /*     TIMING                                                             */ t("init - logOut end");
  }

  debug("init - load subjects data start");
  await api.loadSubjects();
  /*     TIMING                                                               */ t("init - load subjects data end");

  // 2021-07-22 migration step: if the user is signed in but does not have a
  // `user` cached in local storage, fetch it and store it now, otherwise
  // `loadAssignments` will fail. If the user is offline, then error and ask
  // them to go online.
  if (lsGetString("apiKey") && !lsGetString("user")) {
    debug("init - user is missing, fetching now");

    // Must be online for the app to work now, bail out if we're offline
    if (!getOnlineStatus()) {
      debug("init - not online for user fetch");
      notification.error({ message: "Please go online to sync user information. "});
      return;
    }

    await api.syncUser();
    /*     TIMING                                                             */ t("init - syncUser end");
  }

  debug("init - load all start");
  await Promise.all([
    api.loadImages().then(() => t("init - loadImages end")),
    api.loadAssignments().then(() => t("init - loadAssignments end")),
    api.loadLevelProgressions().then(() => t("init - loadLevelProgressions end")),
    api.loadReviewStatistics().then(() => t("init - loadReviewStatistics end")),
    api.loadStudyMaterials().then(() => t("init - loadStudyMaterials end"))
  ]);
  /*     TIMING                                                               */ t("init - load all end");
}
