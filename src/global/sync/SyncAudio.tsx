// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";

import * as api from "@api";

import { useOnlineStatus } from "@utils";
import { throttle } from "lodash-es";

const SYNC_AUDIO_THROTTLE_MS = 5000;
const throttledSync = throttle(api.syncAudio, SYNC_AUDIO_THROTTLE_MS);

/**
 * SyncAudio is responsible for syncing the vocabulary audio with the server on
 * startup, and whenever the user's level changes. The subjects and assignments
 * must be loaded first.
 */
export function SyncAudio(): JSX.Element | null {
  const isOnline = useOnlineStatus();
  const userLevel = api.useUserLevel();
  const subjects = api.useSubjects();
  const assignments = api.useAssignments();
  const subjectAssignmentIdMap = api.useSubjectAssignmentIds();

  useEffect(() => {
    if (!isOnline || userLevel <= 0 || !subjects || !assignments
      || !subjectAssignmentIdMap) return;
    throttledSync();
  }, [isOnline, userLevel, subjects, assignments, subjectAssignmentIdMap]);

  return null;
}
