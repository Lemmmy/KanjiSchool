// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { notification } from "antd";

import { store } from "@app";
import * as actions from "@actions/SessionActions";

import { History } from "history";

import { SessionState } from "./types";

import { reloadAssignments } from "@api";
import { lsSetString, lsSetBoolean } from "@utils";

export function gotoSession(
  history: History,
  sessionState?: SessionState
): void {
  if (!sessionState) return;
  switch (sessionState.type) {
  case "lesson": return history.push("/lesson/session");
  case "review": return history.push("/review/session");
  case "self_study": return history.push("/study/session");
  }
}

/** Forcibly ends the session regardless of whether or not there are any
 * in-progress (started) items. */
export function abandonSession(): void {
  const ongoing = store.getState().session.ongoing;
  if (!ongoing) return;

  store.dispatch(actions.endSession());

  // Remove the session's local storage keys
  lsSetBoolean("sessionOngoing2", false);
  lsSetString("sessionState2", null);

  // And trigger a reload of the assignments/review forecast in the background
  reloadAssignments();

  notification.success({ message: "Session abandoned." });
}

/** Wraps up the session, removing any unstarted items, leaving only the
 * in-progress items. */
export function wrapUpSession(): void {
  store.dispatch(actions.wrapUpSession());

  const stillOngoing = store.getState().session.ongoing;
  if (!stillOngoing) {
    // If the session is no longer ongoing, then remove its local storage keys
    lsSetBoolean("sessionOngoing2", false);
    lsSetString("sessionState2", null);

    // And trigger a reload of the assignments/review forecast in the background
    reloadAssignments();

    notification.success({ message: "Session wrapped up." });
  } else {
    // The localStorage key removal and assignment reloading will be triggered
    // by submitAnswer -> saveSession when the final answer is submitted.
    notification.success({ message: "Session now wrapping up." });
  }
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
