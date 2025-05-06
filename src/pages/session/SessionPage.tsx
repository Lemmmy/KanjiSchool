// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";
import { DeleteOutlined, CloseOutlined, FastForwardOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { PageLayout } from "@layout/PageLayout";
import { useTopMenuOptions } from "@layout/nav/TopMenu";
import { MenuHotkey } from "@comp/MenuHotkey";

import { useNavigate } from "react-router-dom";

import { useAppSelector } from "@store";
import { useDispatch, shallowEqual } from "react-redux";

import { SessionProgress } from "./SessionProgress";
import { SessionLessonsPage } from "./SessionLessonsPage";
import { SessionQuestionsPage } from "./SessionQuestionsPage";
import { SessionDebugInfo } from "./SessionDebugInfo";

import { useSubjects } from "@api";
import { startLessonReviewNow, wrapUpSession } from "@session";
import { showSessionWrapUpModal } from "./modals/SessionWrapUpModal";
import { showSessionAbandonModal } from "@pages/session/modals/SessionAbandonModal";
import { AppLoading } from "@global/AppLoading.tsx";

import { GlobalHotKeys, KeyMap } from "react-hotkeys";
import { useBooleanSetting } from "@utils";

const KEY_MAP: KeyMap = {
  "WRAP_UP": { sequence: "Escape", action: "keydown" },
  "ABANDON": { sequence: "shift+Escape", action: "keydown" }
};

function SessionPage(): React.ReactElement {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const subjects = useSubjects();
  const ongoing = useAppSelector(s => s.session.ongoing);
  const doingLessons = useAppSelector(s => s.session.doingLessons);
  const sessionState = useAppSelector(s => s.session.sessionState, shallowEqual);

  const showProgress = useBooleanSetting("sessionProgressBar");
  const debugInfo = useBooleanSetting("sessionInfoDebug");

  // Redirect back to the dashboard if there is no ongoing session (anymore)
  useEffect(() => {
    if (!ongoing) navigate("/");
  }, [navigate, ongoing]);

  // Wrap-up and abandon session top menu buttons
  const [,set, unset] = useTopMenuOptions();
  useEffect(() => {
    set([
      // Start lesson review now
      doingLessons ? {
        key: "top-start-review",
        onClick: () => startLessonReviewNow(),
        icon: <FastForwardOutlined />,
        label: "Start lesson review now"
      } : null,

      // Wrap up session
      !doingLessons ? {
        key: "top-wrap-up",
        onClick: () => wrapUpSession(),
        icon: <CloseOutlined />,
        label: <>
          Wrap up session
          <MenuHotkey shortcut="Esc" />
        </>
      } : null,

      // Abandon session
      {
        key: "top-abandon",
        onClick: () => showSessionAbandonModal(),
        danger: true,
        icon: <DeleteOutlined />,
        label: <>
          Abandon session
          <MenuHotkey shortcut="Shift+Esc" />
        </>
      }
    ]);

    return unset;
  }, [dispatch, set, unset, doingLessons]);

  if (!sessionState || !subjects) {
    return <AppLoading />;
  }

  // Show the table of contents if lessons are happening
  const classes = classNames("w-full", {
    "has-toc": doingLessons
  });

  return <PageLayout
    siteTitle="Session"
    centered
    className={classes}
  >
    {/* Top progress bar */}
    {showProgress && <SessionProgress
      className="!rounded-none md:!rounded-2xl absolute inset-x-0 top-0 md:static"
      heightClassName="h-[2rem] md:h-[12px]"
    />}

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

export const Component = SessionPage;
