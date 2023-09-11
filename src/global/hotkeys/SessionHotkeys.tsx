// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback } from "react";

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import { GlobalHotKeys, KeyMap } from "react-hotkeys";

import { useNavigate, useMatch } from "react-router-dom";

import { SessionType, gotoSession, startSession } from "@session";
import { showSessionAbandonModal } from "@pages/session/modals/SessionAbandonModal";

import Debug from "debug";
const debug = Debug("kanjischool:session-hotkeys");

// Trigger on `keyup` specifically so that the question input doesn't get filled
const KEY_MAP: KeyMap = {
  START_LESSONS: { group: "dashboard", sequence: "l", action: "keyup" },
  START_REVIEWS: { group: "dashboard", sequence: "r", action: "keyup" },
  START_SELF_STUDY: { group: "dashboard", sequence: "s", action: "keyup" },
  ABANDON_SESSION: { group: "dashboard", sequence: "a", action: "keyup" },
};

export function SessionHotkeys(): JSX.Element | null {
  const navigate = useNavigate();

  // Disable the hotkeys on the session pages, so typing will still autofocus the inputs.
  const reviewMatch = useMatch("/review/session");
  const lessonMatch = useMatch("/lesson/session");
  const studyMatch = useMatch("/study/session");

  const pendingLessons = useAppSelector(s => s.reviews.pendingLessons);
  const pendingReviews = useAppSelector(s => s.reviews.pendingReviews);

  // Get session state to resume session if possible
  const { ongoing, sessionState } =
    useAppSelector(s => s.session, shallowEqual);

  const onSessionHotkey = useCallback((type: SessionType) => {
    debug("session hotkey pressed");

    // If there is an ongoing session, resume it (regardless of the hotkey)
    if (ongoing) {
      if (!sessionState) { // Ignore if no sessionState yet
        debug("hotkey: resuming session but no sessionState, ignoring");
        return;
      }

      debug("hotkey: resuming session");
      gotoSession(navigate, sessionState);
      return;
    }

    // If this is a lesson hotkey and there are pending lessons, start them
    if (type === "lesson" && pendingLessons.length) {
      debug("hotkey: starting lessons");
      gotoSession(navigate, startSession("lesson"));
      return;
    }

    // If this is a review hotkey and there are pending reviews, start them
    if (type === "review" && pendingReviews.length) {
      debug("hotkey: starting reviews");
      gotoSession(navigate, startSession("review"));
      return;
    }
  }, [pendingLessons.length, pendingReviews.length, navigate, ongoing, sessionState]);

  const onHotkeyStartLessons = useCallback(() =>
    onSessionHotkey("lesson"), [onSessionHotkey]);
  const onHotkeyStartReviews = useCallback(() =>
    onSessionHotkey("review"), [onSessionHotkey]);
  const onHotkeyStartSelfStudy = useCallback(() =>
    navigate("/study"), [navigate]);
  const onHotkeyAbandonSession = useCallback(() =>
    showSessionAbandonModal(), []);

  // Don't render the hotkeys if on a session page
  if (reviewMatch || lessonMatch || studyMatch) return null;

  return <GlobalHotKeys
    keyMap={KEY_MAP}
    handlers={{
      START_LESSONS: onHotkeyStartLessons,
      START_REVIEWS: onHotkeyStartReviews,
      START_SELF_STUDY: onHotkeyStartSelfStudy,
      ABANDON_SESSION: onHotkeyAbandonSession,
    }}
    allowChanges
  />;
}
