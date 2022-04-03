// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";

import * as api from "@api";
import { RootState } from "@store";
import { useSelector } from "react-redux";

import { useOnlineStatus } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:sync-subjects-global");

/**
 * SyncSubjects is responsible for ensuring the subjects are up to date on
 * startup.
 */
export function SyncSubjects(): JSX.Element | null {
  const isOnline = useOnlineStatus();
  const subjectsSyncedThisSession =
    useSelector((s: RootState) => s.sync.subjectsSyncedThisSession);

  useEffect(() => {
    if (subjectsSyncedThisSession || !isOnline) return;
    debug("SyncSubjects is syncing subjects");
    api.syncSubjects();
  }, [subjectsSyncedThisSession, isOnline]);

  return null;
}
