// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button } from "@comp/Button";
import { useCallback } from "react";

import { useAppSelector } from "@store";

import { syncRefresh, useUser } from "@api";

import { useOnlineStatus } from "@utils";

import { globalNotification } from "@global/AntInterface.tsx";

import Debug from "debug";
import { LoaderCircle } from "lucide-react";
const debug = Debug("kanjischool:summary-refresh");

interface Props {
  className?: string;
}

export function RefreshButton({ className }: Props): React.ReactElement {
  const isOnline = useOnlineStatus();

  const user = useUser();

  const syncing = useAppSelector(s => s.sync.syncingAssignments);
  const canRefresh = useAppSelector(s =>
    s.assignments.assignments && s.reviews.pendingLessons && s.reviews.pendingReviews);

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
    variant="link"
    onClick={refresh}
    disabled={syncing || !isOnline}
    className={className}
  >
    {syncing && <LoaderCircle className="animate-spin" />}
    Refresh
  </Button>;
}
