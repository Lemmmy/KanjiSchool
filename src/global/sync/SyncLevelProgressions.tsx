// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";

import * as api from "@api";
import { useOnlineStatus } from "@utils";

/**
 * SyncLevelProgressions is responsible for syncing the level progressions with
 * the server on startup, and whenever the user's level changes. The subjects
 * must be loaded first.
 */
export function SyncLevelProgressions(): JSX.Element | null {
  const isOnline = useOnlineStatus();
  const userLevel = api.useUserLevel();
  const subjects = !!api.useSubjects();

  useEffect(() => {
    if (!isOnline || userLevel <= 0 || !subjects) return;
    api.syncLevelProgressions();
  }, [isOnline, userLevel, subjects]);

  return null;
}
