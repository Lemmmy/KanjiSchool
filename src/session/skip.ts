// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";

import { store } from "@store";
import {
  SkipQuestionPayload,
  skipQuestionDelay,
  skipQuestionPutEnd,
  skipQuestionRemove,
  endSession
} from "@store/slices/sessionSlice.ts";

import { saveSession } from "@session";

import { globalMessage } from "@global/AntInterface.tsx";

import { v4 as uuidv4 } from "uuid";

import Debug from "debug";
const debug = Debug("kanjischool:session-skip");

/**
 * Different types of question skipping.
 *
 * - DELAY - Put the question back into the same bucket with a choice delay of
 *     3. In most cases it will appear later, but it may still appear
 *     immediately.
 * - PUT_END - Put the question back into the highest bucket so that it
 *     appears at the end of the session, with a choice delay of 3.
 * - REMOVE - Remove the item (both questions) from the session entirely.
 */
export type SkipType = "DELAY" | "PUT_END" | "REMOVE";
const SKIP_NOTIFICATIONS: Record<SkipType, ReactNode> = {
  "DELAY": "Question skipped.",
  "PUT_END": "Subject skipped and put back to end of queue.",
  "REMOVE": "Subject skipped and removed from queue.",
};

let prevSkipNotification: string;

export function skipQuestion(
  type: "meaning" | "reading",
  itemId: number
): boolean {
  if (!store.getState().settings.skipEnabled) return false;
  const skipType = store.getState().settings.skipType;

  // Trigger the appropriate skip action based on the user's setting
  const payload: SkipQuestionPayload = { type, itemId };
  if (skipType === "DELAY") {
    store.dispatch(skipQuestionDelay(payload));
  } else if (skipType === "PUT_END") {
    store.dispatch(skipQuestionPutEnd(payload));
  } else if (skipType === "REMOVE") {
    store.dispatch(skipQuestionRemove(payload));
  }

  // Figure out if the session is now complete (questions list is empty)
  const sessionState = store.getState().session.sessionState;
  if (!sessionState) throw new Error("no session state");
  const sessionComplete = sessionState.questions.length === 0;

  // Session is complete, clear it from the Redux store
  if (sessionComplete) {
    debug("session complete, clearing from redux");
    store.dispatch(endSession());
  }

  debug("saving session");
  saveSession();

  return sessionComplete;
}

export function showSkipNotification(
  type: SkipType | "complete"
): void {
  // Only allow one skip notification
  const key = uuidv4();
  if (prevSkipNotification) globalMessage.destroy(prevSkipNotification);

  globalMessage.info({
    content: type === "complete"
      ? "Last subject skipped, wrapping up session."
      : SKIP_NOTIFICATIONS[type],
    duration: 1,
    className: "skip-notification",
    key
  });
  prevSkipNotification = key;
}
