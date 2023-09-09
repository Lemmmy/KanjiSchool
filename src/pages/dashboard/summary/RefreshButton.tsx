// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback } from "react";
import { Button } from "antd";

import { RootState } from "@store";
import { useSelector } from "react-redux";

import { useUser, syncRefresh } from "@api";

import { useOnlineStatus } from "@utils";

import { globalNotification } from "@global/AntInterface.tsx";

import Debug from "debug";
const debug = Debug("kanjischool:summary-refresh");

interface Props {
  className?: string;
}

export function RefreshButton({ className }: Props): JSX.Element {
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
        globalNotification.error({ message: "Could not refresh assignments." });
      });
  }, [user?.data.id, canRefresh]);

  return <Button
    type="link"
    loading={syncing}
    onClick={refresh}
    disabled={!isOnline}
    className={className}
  >
    Refresh
  </Button>;
}
