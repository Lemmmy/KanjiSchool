// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useCallback, useEffect } from "react";

import { useInterval, useOnlineStatus } from "@utils/hooks";

import * as api from "@api";

import { globalNotification } from "@global/AntInterface.tsx";
import dayjs from "dayjs";

import Debug from "debug";
const debug = Debug("kanjischool:assignment-sync-service");

/**
 * SyncAssignments is responsible for syncing the assignments with the server
 * at the start of every hour. It also syncs the user, review statistics and
 * reviews at the same time.
 */
export function SyncAssignments(): JSX.Element | null {
  const isOnline = useOnlineStatus();
  const user = api.useUser();

  const [lastHourChecked, setLastHourChecked] =
    useState<number>(dayjs.utc().hour());

  const sync = useCallback(() => {
    // Don't refresh if there's no state loaded yet
    if (!user?.data.id) return;

    debug("automatically performing a refresh sync");
    api.syncRefresh()
      .catch(err => {
        console.error(err);
        globalNotification.error({ message: "Could not automatically sync assignments." });
      });
  }, [user?.data.id]);

  const check = useCallback(() => {
    // Do nothing if we're not online.
    if (!isOnline) return;

    const now = new Date();
    const nowHour = now.getHours();
    const nowSeconds = now.getSeconds();

    // Don't check in the first 5 seconds of a minute, to account for potential
    // clock differences (very lazy, sorry)
    if (nowSeconds < 5) return;

    // NOTE: In hindsight, this actually doesn't matter, because the client is
    //       the one responsible for all time calculations. The server only
    //       cares about the time when *submitting* a review, and the
    //       assignments won't actually change when they're available. The only
    //       thing that would change (dependent of the server's clock) is the
    //       /reviews endpoint, which we don't use anymore.

    if (nowHour !== lastHourChecked) {
      setLastHourChecked(nowHour);
      sync();
    }
  }, [sync, lastHourChecked, isOnline]);

  // Always perform the sync on the first mount and when we become online again
  useEffect(() => {
    if (!isOnline) return;
    sync();
  }, [sync, isOnline]);

  // Check if the time is greater than reviews available time every 5s
  useInterval(check, 5000);

  return null;
}
