// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, useState } from "react";

import * as api from "@api";
import { syncImages } from "@api";

import { useOnlineStatus } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:sync-images-global");

/**
 * SyncImages is responsible for downloading the subject radical images when the
 * application starts.
 */
export function SyncImages(): React.ReactElement | null {
  const [hasSynced, setHasSynced] = useState(false);
  const isOnline = useOnlineStatus();
  const subjects = !!api.useSubjects();

  useEffect(() => {
    if (hasSynced || !isOnline || !subjects) return;
    debug("SyncImages starting sync");
    setHasSynced(true);
    syncImages().catch((err) => {
      debug("SyncImages failed to sync", err);
    });
  }, [hasSynced, isOnline, subjects]);

  return null;
}
