// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect } from "react";

import { Provider } from "react-redux";
import { initStore } from "@store/init";

import { AppLayout } from "@layout/AppLayout";
import { InnerAppServices } from "@global/InnerAppServices.tsx";
import { UpdateCheck } from "@global/UpdateCheck";
import { StudyQueueHotkeyHandlerProvider } from "@comp/study-queue/StudyQueueHotkeyHandler";
import { PresetModalProvider } from "@comp/preset-editor/PresetModalContext";

import { initDbAndLoadAll, useHasSubjects, useIsLoggedIn } from "@api";

import { ConfigProvider, notification } from "antd";
import { AppLoading } from "@global/AppLoading";
import { LoginPage } from "@pages/login/LoginPage";
import { SyncPage } from "@pages/login/SyncPage";

import { WkErrorBoundary } from "@comp/ErrorBoundary";

import { getTheme } from "@global/theme";

import Debug from "debug";
import { ThemeProvider } from "@global/theme/ThemeContext.tsx";
import { AppServices } from "@global/AppServices.tsx";
const debug = Debug("kanjischool:app");

export let store: ReturnType<typeof initStore>;

export default function App(): JSX.Element {
  debug("upper App rendering");
  if (!store) store = initStore();

  return <>
    <ThemeProvider>
      {(themeName) => <ConfigProvider theme={getTheme(themeName).antTheme}>
        {/* Have the update checker run at the highest level possible, as it is
        * responsible for registering the service worker. */}
        <UpdateCheck />

        <Provider store={store}>
          {/* Highest level error boundary underneath the Redux store, to prevent
          * nuking the data if something goes SUPER wrong. If the Redux store gets
          * re-initialized due to the uppermost App component re-rendering, it
          * will trigger further errors and probably cause confusion while
          * debugging. */}
          <WkErrorBoundary name="app-top-level">
            <AppServices />
            <AppInner />
          </WkErrorBoundary>
        </Provider>
      </ConfigProvider>}
    </ThemeProvider>
  </>;
}

/**
 * The inner app is responsible for initializing the database, loading the
 * data, and deciding whether to render the app, or the login screen. Doing this
 * in an inner component removes the responsibility for re-renders on the entire
 * app (including initStore and the update checker.)
 */
function AppInner(): JSX.Element {
  // Whether the database has been initialized and loaded
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
        console.error(err);
        notification.error({ message: "Error loading database. "});
      });
  }, [dbInit]);

  // If the database has not yet been initialized, show a preloader screen.
  if (!dbInit) return <AppLoading title="Loading database..." />;

  // If the user is not yet logged in, show the login page.
  if (!loggedIn) return <LoginPage />;

  // If no subjects have been downloaded yet, show the sync page.
  if (!hasSubjects) return <SyncPage />;

  // If the user data is present (user is logged in, or it is cached), render the
  // whole app and router.
  return <PresetModalProvider>
    <StudyQueueHotkeyHandlerProvider>
      <WkErrorBoundary name="app-layout-and-services">
        <AppLayout />
        <InnerAppServices />
      </WkErrorBoundary>
    </StudyQueueHotkeyHandlerProvider>
  </PresetModalProvider>;
}
