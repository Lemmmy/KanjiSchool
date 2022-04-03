// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback } from "react";
import { notification, Button } from "antd";

import { RootState } from "@store";
import { useSelector } from "react-redux";

import { useUser, syncRefresh } from "@api";

import { useOnlineStatus } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:summary-refresh");

export function RefreshButton(): JSX.Element {
  const isOnline = useOnlineStatus();

  const user = useUser();

  const syncing = useSelector((s: RootState) => s.sync.syncingAssignments);
  const canRefresh = useSelector((s: RootState) =>
    s.sync.assignments && s.sync.pendingLessons && s.sync.pendingReviews);

  const refresh = useCallback(() => {
    // Don't refresh if there's no state loaded yet
    if (!user?.data.id || !canRefresh) return;

    debug("summary card requested force refresh");
    syncRefresh(true)
      .catch(err => {
        console.error(err);
        notification.error({ message: "Could not refresh assignments." });
      });
  }, [user?.data.id, canRefresh]);

  return <Button
    type="link"
    loading={syncing}
    onClick={refresh}
    disabled={!isOnline}
  >
    Refresh
  </Button>;
}
