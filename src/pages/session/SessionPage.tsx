// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";
import { Menu } from "antd";
import { DeleteOutlined, CloseOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { PageLayout } from "@layout/PageLayout";
import { useTopMenuOptions } from "@layout/nav/TopMenu";
import { MenuHotkey } from "@comp/MenuHotkey";

import { useHistory } from "react-router-dom";

import { RootState } from "@store";
import { useDispatch, useSelector, shallowEqual } from "react-redux";

import { SessionProgress } from "./SessionProgress";
import { SessionLessonsPage } from "./SessionLessonsPage";
import { SessionQuestionsPage } from "./SessionQuestionsPage";
import { SessionDebugInfo } from "./SessionDebugInfo";

import { useSubjects } from "@api";
import { wrapUpSession } from "@session";
import { showSessionWrapUpModal } from "./modals/SessionWrapUpModal";
import { showSessionAbandonModal } from "@pages/session/modals/SessionAbandonModal";

import { GlobalHotKeys, KeyMap } from "react-hotkeys";
import { useBooleanSetting } from "@utils";

const KEY_MAP: KeyMap = {
  "WRAP_UP": { sequence: "Escape", action: "keydown" },
  "ABANDON": { sequence: "shift+Escape", action: "keydown" }
};

export function SessionPage(): JSX.Element {
  const dispatch = useDispatch();
  const history = useHistory();

  const subjects = useSubjects();
  const ongoing = useSelector((s: RootState) => s.session.ongoing);
  const doingLessons = useSelector((s: RootState) => s.session.doingLessons);
  const sessionState = useSelector((s: RootState) => s.session.sessionState, shallowEqual);

  const showProgress = useBooleanSetting("sessionProgressBar");
  const debugInfo = useBooleanSetting("sessionInfoDebug");

  // Redirect back to the dashboard if there is no ongoing session (anymore)
  // TODO: This is a temporary workaround for session wrap-up and abandon. When
  //       a results screen is added, this will not work.
  useEffect(() => {
    if (!ongoing) history.push("/");
  }, [history, ongoing]);

  // Wrap-up and abandon session top menu buttons
  const [,set, unset] = useTopMenuOptions();
  useEffect(() => {
    set(<>
      {/* Wrap up session */}
      {!doingLessons && (
        <Menu.Item
          key="top-wrap-up"
          onClick={() => wrapUpSession()}
          className="menu-item-has-hotkey"
        >
          <CloseOutlined />Wrap up session
          <MenuHotkey shortcut="Esc" />
        </Menu.Item>
      )}

      {/* Abandon session */}
      <Menu.Item
        key="top-abandon"
        danger
        onClick={() => showSessionAbandonModal()}
        className="menu-item-has-hotkey"
      >
        <DeleteOutlined />Abandon session
        <MenuHotkey shortcut="Shift+Esc" />
      </Menu.Item>
    </>);

    return unset;
  }, [dispatch, set, unset, doingLessons]);

  if (!sessionState || !subjects)
    return <b>Loading...</b>;

  // Show the table of contents if lessons are happening
  const classes = classNames("session-page", "page-centered", {
    "has-toc": doingLessons
  });

  return <PageLayout
    siteTitle="Session"
    className={classes}
  >
    {/* Top progress bar */}
    {showProgress && <SessionProgress />}

    {doingLessons
      ? <SessionLessonsPage />
      : <SessionQuestionsPage />}

    {/* Debug stuff */}
    {debugInfo && <SessionDebugInfo />}

    <GlobalHotKeys
      keyMap={KEY_MAP}
      handlers={{
        WRAP_UP: e => {
          e?.preventDefault();
          showSessionWrapUpModal();
        },
        ABANDON: e => {
          e?.preventDefault();
          showSessionAbandonModal();
        }
      }}
    />
  </PageLayout>;
}
