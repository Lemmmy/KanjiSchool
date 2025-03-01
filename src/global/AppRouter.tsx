// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { createBrowserRouter } from "react-router-dom";

import { NotFoundPage } from "@pages/NotFoundPage";
import { ErroredRoute } from "@comp/ErrorBoundary";
import App from "@app";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErroredRoute />,
    children: [
      { path: "/",                 lazy: () => import("@pages/dashboard/DashboardPage.tsx") },

      { path: "/radical/:slug",    lazy: () => import("@pages/subject/pages/RadicalSubjectPage.tsx") },
      { path: "/kanji/:slug",      lazy: () => import("@pages/subject/pages/KanjiSubjectPage.tsx") },
      { path: "/vocabulary/:slug", lazy: () => import("@pages/subject/pages/VocabularySubjectPage.tsx") },

      { path: "/lesson/session",   lazy: () => import("@pages/session/SessionPage.tsx") },
      { path: "/review/session",   lazy: () => import("@pages/session/SessionPage.tsx") },
      { path: "/study/session",    lazy: () => import("@pages/session/SessionPage.tsx") },

      { path: "/search",           lazy: () => import("@pages/search/AdvancedSearchPage.tsx") },
      { path: "/study",            lazy: () => import("@pages/search/AdvancedSearchPageSelfStudy.tsx") },

      { path: "/items/wk",         lazy: () => import("@pages/items/WkItemsPage.tsx") },
      { path: "/items/jlpt",       lazy: () => import("@pages/items/JlptItemsPage.tsx") },
      { path: "/items/joyo",       lazy: () => import("@pages/items/JoyoItemsPage.tsx") },
      { path: "/items/frequency",  lazy: () => import("@pages/items/FreqItemsPage.tsx") },

      { path: "/settings",         lazy: () => import("@pages/settings/SettingsPage.tsx") },
      { path: "/debug",            lazy: () => import("@pages/debug/DebugPage.tsx") },

      { path: "*",                 element: <NotFoundPage /> }
    ]
  },
]);
