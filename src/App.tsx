// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect } from "react";

import { Provider } from "react-redux";
import { initStore, store } from "@store";

import { AppLayout } from "@layout/AppLayout";
import { InnerAppServices } from "@global/InnerAppServices.tsx";
import { StudyQueueHotkeyHandlerProvider } from "@comp/study-queue/StudyQueueHotkeyHandler";
import { PresetModalProvider } from "@comp/preset-editor/PresetModalContext";

import { initDbAndLoadAll, useHasSubjects, useIsLoggedIn } from "@api";

import { App as AntApp, Button, ConfigProvider } from "antd";
import { AppLoading } from "@global/AppLoading";
import { LoginPage } from "@pages/login/LoginPage";
import { SyncPage } from "@pages/login/SyncPage";
import { ExtLink } from "@comp/ExtLink.tsx";
import { lsGetString, lsSetString } from "@utils";

import { WkErrorBoundary } from "@comp/ErrorBoundary";

import { getTheme } from "@global/theme";
import AntInterface, { globalNotification, messageConfig, notificationConfig } from "@global/AntInterface.tsx";
import { ThemeProvider } from "@global/theme/ThemeContext.tsx";
import { AppServices } from "@global/AppServices.tsx";
import { ServiceWorkerContextProvider } from "@global/update/ServiceWorkerContext.tsx";
import { UpdateCheckNotification } from "@global/update/UpdateCheckNotification.tsx";

import Debug from "debug";
const debug = Debug("kanjischool:app");

export default function App(): JSX.Element {
  debug("upper App rendering");
  initStore();

  return <>
    <ThemeProvider>
      {(themeName) => <ConfigProvider theme={getTheme(themeName).antTheme}>
        <AntApp message={messageConfig} notification={notificationConfig}>
          {/* Provide the globals for message, modal, and notification. */}
          <AntInterface />

          {/* Have the update checker run at the highest level possible, as it is
            * responsible for registering the service worker. */}
          <ServiceWorkerContextProvider>
            <Provider store={store}>
              {/* Highest level error boundary underneath the Redux store, to prevent
                * nuking the data if something goes SUPER wrong. If the Redux store gets
                * re-initialized due to the uppermost App component re-rendering, it
                * will trigger further errors and probably cause confusion while
                * debugging. */}
              <WkErrorBoundary name="app-top-level">
                <AppServices />
                <UpdateCheckNotification />
                <AppInner />
              </WkErrorBoundary>
            </Provider>
          </ServiceWorkerContextProvider>
        </AntApp>
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

  // Show an update notification if the app version has changed
  useEffect(() => {
    const gitVersion: string = import.meta.env.VITE_GIT_VERSION;
    // Don't show an update notification if the user hasn't logged in before (lastAppVersion wouldn't be set yet)
    const lastVersion = lsGetString("lastAppVersion", loggedIn ? undefined : gitVersion);

    debug("git version: %s - last version: %s", gitVersion, lastVersion);

    if (lastVersion !== gitVersion) {
      globalNotification.success({
        message: "Update complete",
        description: <>
          KanjiSchool updated to <span className="whitespace-nowrap font-semibold">{gitVersion}</span>!
        </>,
        btn: <ExtLink href="https://github.com/Lemmmy/KanjiSchool/releases">
          <Button type="primary">What&apos;s new</Button>
        </ExtLink>
      });
    }

    lsSetString("lastAppVersion", gitVersion);
  }, [loggedIn]);

  // Initialize the database
  useEffect(() => {
    if (dbInit) return;
    initDbAndLoadAll()
      .then(() => setDbInit(true))
      .catch(err => {
        console.error(err);
        globalNotification.error({ message: "Error loading database. "});
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
