// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import {
  endSession,
  wrapUpSession as wrapUpSessionAction,
  startLessonReviewNow as startLessonReviewNowAction
} from "@store/slices/sessionSlice.ts";

import { SessionState } from "./types";

import { reloadAssignments } from "@api";
import { lsSetString, lsSetBoolean, pluralN } from "@utils";
import { NavigateFunction } from "react-router-dom";

import { globalNotification } from "@global/AntInterface.tsx";

export function gotoSession(
  navigate: NavigateFunction,
  sessionState?: SessionState
): void {
  if (!sessionState) return;
  switch (sessionState.type) {
  case "lesson": return navigate("/lesson/session");
  case "review": return navigate("/review/session");
  case "self_study": return navigate("/study/session");
  }
}

/** Forcibly ends the session regardless of whether there are any in-progress (started) items. */
export function abandonSession(): void {
  const ongoing = store.getState().session.ongoing;
  if (!ongoing) return;

  store.dispatch(endSession());

  // Remove the session's local storage keys
  lsSetBoolean("sessionOngoing2", false);
  lsSetString("sessionState2", null);

  // And trigger a reload of the assignments/review forecast in the background
  reloadAssignments();

  globalNotification.success({ message: "Session abandoned." });
}

/** Wraps up the session, removing any unstarted items, leaving only the
 * in-progress items. */
export function wrapUpSession(): void {
  store.dispatch(wrapUpSessionAction());

  const stillOngoing = store.getState().session.ongoing;
  if (!stillOngoing) {
    // If the session is no longer ongoing, then remove its local storage keys
    lsSetBoolean("sessionOngoing2", false);
    lsSetString("sessionState2", null);

    // And trigger a reload of the assignments/review forecast in the background
    reloadAssignments();

    globalNotification.success({ message: "Session wrapped up." });
  } else {
    // The localStorage key removal and assignment reloading will be triggered
    // by submitAnswer -> saveSession when the final answer is submitted.
    globalNotification.success({ message: "Session now wrapping up." });
  }
}

export function startLessonReviewNow(): void {
  const count = store.getState().session.lessonCounter + 1;
  store.dispatch(startLessonReviewNowAction());
  globalNotification.info({ message: `Lesson review started with ${pluralN(count, "lesson")}` });
}

export * from "./chooseQuestion";
export * from "./notif";
export * from "./skip";
export * from "./start";
export * from "./storage";
export * from "./studyQueue";
export * from "./submission";
export * from "./types";
export * from "./utils";
