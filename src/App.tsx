// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { Provider } from "react-redux";
import { initStore } from "@store/init";

import "./style/themes/dark.less";

import { AppLayout } from "@layout/AppLayout";
import { AppServices } from "@global/AppServices";
import { UpdateCheck } from "@global/UpdateCheck";
import { StudyQueueHotkeyHandlerProvider } from "@comp/study-queue/StudyQueueHotkeyHandler";
import { PresetModalProvider } from "@comp/preset-editor/PresetModalContext";

import { initDbAndLoadAll, useHasSubjects, useIsLoggedIn } from "@api";

import { notification } from "antd";
import { AppLoading } from "@global/AppLoading";
import { LoginPage } from "@pages/login/LoginPage";
import { SyncPage } from "@pages/login/SyncPage";

import { criticalError } from "@utils";
import { ErrorBoundary } from "@comp/ErrorBoundary";

import Debug from "debug";
const debug = Debug("kanjischool:app");

export let store: ReturnType<typeof initStore>;

export default function App(): JSX.Element {
  debug("upper App rendering");
  if (!store) store = initStore();

  return <>
    {/* Have the update checker run at the highest level possible, as it is
      * responsible for registering the service worker. */}
    <UpdateCheck />

    <Provider store={store}>
      {/* Highest level error boundary underneath the Redux store, to prevent
        * nuking the data if something goes SUPER wrong. If the Redux store gets
        * re-initialized due to the uppermost App component re-rendering, it
        * will trigger further errors and probably cause confusion while
        * debugging. */}
      <ErrorBoundary name="app-top-level">
        <AppInner />
      </ErrorBoundary>
    </Provider>
  </>;
}

/**
 * The inner app is responsible for initializing the database, loading the
 * data, and deciding whether to render the app, or the login screen. Doing this
 * in an inner component removes the responsibility for re-renders on the entire
 * app (including initStore and the update checker.)
 */
function AppInner(): JSX.Element {
  // Whether or not the database has been initialized and loaded
  const [dbInit, setDbInit] = useState(false);
  const loggedIn = useIsLoggedIn();
  const hasSubjects = useHasSubjects();

  debug("AppInner render: dbInit %s - loggedIn %s - hasSubjects %s",
    dbInit, loggedIn, hasSubjects);

  // Initialize the database
  useEffect(() => {
    if (dbInit) return;
    initDbAndLoadAll()
      .then(() => setDbInit(true))
      .catch(err => {
        criticalError(err);
        notification.error({ message: "Error loading database. "});
      });
  }, [dbInit]);

  // If the database has not yet been initialized, show a preloader screen.
  if (!dbInit) return <AppLoading title="Loading database..." />;

  // If the user is not yet logged in, show the login page.
  if (!loggedIn) return <LoginPage />;

  // If no subjects have been downloaded yet, show the sync page.
  if (!hasSubjects) return <SyncPage />;

  // If the user data is present (user is logged in or it is cached), render the
  // whole app and router.
  return <Router>
    <PresetModalProvider>
      <StudyQueueHotkeyHandlerProvider>
        <ErrorBoundary name="app-layout-and-services">
          <AppLayout />
          <AppServices />
        </ErrorBoundary>
      </StudyQueueHotkeyHandlerProvider>
    </PresetModalProvider>
  </Router>;
}
