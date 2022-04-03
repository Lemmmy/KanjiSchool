// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { notification } from "antd";

import * as api from "@api";

import Debug from "debug";
const debug = Debug("kanjischool:api-sync-all");

export async function syncAll(full?: boolean): Promise<void> {
  debug("syncing all data");

  const user = await api.syncUser();
  if (!user?.data?.id) {
    debug("login response: %o", user);
    notification.error({ message: "Login failed" });
    throw new Error("Login failed: no user ID");
  }

  // Begin syncing subjects, then assignments (which will also update the user)
  api.syncSubjects()
    .then(() => Promise.all([
      api.syncAssignments(full),
      api.syncReviewStatistics(full),
      api.syncReviews(full), // DO full refresh reviews
      api.syncLevelProgressions(full),
      api.syncStudyMaterials(full),
      api.syncImages(),
      api.processQueue() // Process the submission queue if there's anything to
    ]));
}

/**
 * This is a variant of syncAll for the hourly assignment sync and summary
 * 'refresh' button. It syncs the user, assignments, review statistics, reviews,
 * and study materials.
 */
export async function syncRefresh(full?: boolean): Promise<void[]> {
  debug("sync refresh");

  const user = await api.syncUser();
  if (!user?.data?.id) {
    debug("login response: %o", user);
    notification.error({ message: "Login failed" });
    throw new Error("Login failed: no user ID");
  }

  return Promise.all([
    api.syncAssignments(full),
    api.syncReviewStatistics(full),
    api.syncStudyMaterials(full),
    api.syncReviews() // DO NOT full refresh reviews
  ]);
}

/**
 * This is a variant of syncAll designed for SyncWhenOnline - the other sync
 * services handle their own data, so this handles all the loose ends.
 * For now, this is just the user and the submission queue.
 */
export async function syncPartial(): Promise<void> {
  debug("syncing partial data");

  const user = await api.syncUser();
  if (!user?.data?.id) {
    debug("login response: %o", user);
    notification.error({ message: "Login failed" });
    throw new Error("Login failed: no user ID");
  }

  api.processQueue();
}
