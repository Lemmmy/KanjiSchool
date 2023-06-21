// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";

import { SessionState } from "./";

import { lsGetString, lsSetString, lsSetBoolean, lsGetKey, lsSetNumber } from "@utils";

export function loadSession(): SessionState | undefined {
  const data = lsGetString("sessionState2") || undefined;
  if (!data) {
    // Check if there are any legacy keys and remove them
    localStorage.removeItem(lsGetKey("sessionOngoing"));
    localStorage.removeItem(lsGetKey("sessionState"));
    return undefined;
  }

  return JSON.parse(data) as SessionState;
}

export function saveSession(): void {
  const { ongoing, sessionState, doingLessons, lessonCounter }
    = store.getState().session;

  lsSetBoolean("sessionOngoing2", ongoing);
  lsSetBoolean("sessionDoingLessons", doingLessons);
  lsSetNumber("sessionLessonCounter", lessonCounter);
  lsSetString("sessionState2", sessionState ? JSON.stringify(sessionState) : null);
}
