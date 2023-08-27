// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { createBrowserRouter, Route, Routes } from "react-router-dom";

import { DashboardPage } from "@pages/dashboard/DashboardPage";
import { SubjectPage } from "@pages/subject/SubjectPage";
import { SessionPage } from "@pages/session/SessionPage";

import { AdvancedSearchPage } from "@pages/search/AdvancedSearchPage";
import { ItemsPage } from "@pages/items/ItemsPage";

import { SettingsPage } from "@pages/settings/SettingsPage";
import { DebugPage } from "@pages/debug/DebugPage";
import { DebugPickTest } from "@pages/debug/PickTest";

import { NotFoundPage } from "@pages/NotFoundPage";
import { ErroredRoute } from "@comp/ErrorBoundary";
import App from "@app";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErroredRoute />,
    children: [
      { path: "/", element: <DashboardPage /> },

      { path: "/radical/:slug",    element: <SubjectPage type="radical" /> },
      { path: "/kanji/:slug",      element: <SubjectPage type="kanji" /> },
      { path: "/vocabulary/:slug", element: <SubjectPage type="vocabulary" /> },

      { path: "/lesson/session",   element: <SessionPage /> },
      { path: "/review/session",   element: <SessionPage /> },
      { path: "/study/session",    element: <SessionPage /> },

      { path: "/search",           element: <AdvancedSearchPage /> },
      { path: "/study",            element: <AdvancedSearchPage selfStudy /> },

      { path: "/items/wk",         element: <ItemsPage type="wk" /> },
      { path: "/items/jlpt",       element: <ItemsPage type="jlpt" /> },
      { path: "/items/joyo",       element: <ItemsPage type="joyo" /> },
      { path: "/items/frequency",  element: <ItemsPage type="freq" /> },

      { path: "/settings",         element: <SettingsPage /> },
      { path: "/debug",            element: <DebugPage /> },
      { path: "/debug/picktest",   element: <DebugPickTest /> },

      { path: "*",                 element: <NotFoundPage /> }
    ]
  },
]);
