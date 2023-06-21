// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Switch, Route, Redirect } from "react-router-dom";

import { DashboardPage } from "@pages/dashboard/DashboardPage";
import { SubjectPage } from "@pages/subject/SubjectPage";
import { SessionPage } from "@pages/session/SessionPage";

import { AdvancedSearchPage } from "@pages/search/AdvancedSearchPage";
import { ItemsPage } from "@pages/items/ItemsPage";

import { SettingsPage } from "@pages/settings/SettingsPage";
import { DebugPage } from "@pages/debug/DebugPage";
import { DebugPickTest } from "@pages/debug/PickTest";

import { NotFoundPage } from "@pages/NotFoundPage";
import { ErrorBoundary } from "@comp/ErrorBoundary";

interface AppRoute {
  path: string;
  name: string;
  component?: React.ReactNode;
}

export const APP_ROUTES: AppRoute[] = [
  { path: "/", name: "dashboard", component: <DashboardPage /> },

  { path: "/radical/:slug", name: "subjectRadical", component: <SubjectPage type="radical" /> },
  { path: "/kanji/:slug", name: "subjectKanji", component: <SubjectPage type="kanji" /> },
  { path: "/vocabulary/:slug", name: "subjectVocabulary", component: <SubjectPage type="vocabulary" /> },

  { path: "/lesson/session", name: "lessonSession", component: <SessionPage /> },
  { path: "/review/session", name: "reviewSession", component: <SessionPage /> },
  { path: "/study/session", name: "studySession", component: <SessionPage /> },

  { path: "/search", name: "advancedSearch", component: <AdvancedSearchPage /> },
  { path: "/study", name: "selfStudySearch", component: <AdvancedSearchPage selfStudy /> },

  { path: "/items/wk", name: "itemsWk", component: <ItemsPage type="wk" /> },
  { path: "/items/jlpt", name: "itemsJlpt", component: <ItemsPage type="jlpt" /> },
  { path: "/items/joyo", name: "itemsJoyo", component: <ItemsPage type="joyo" /> },
  { path: "/items/frequency", name: "itemsFreq", component: <ItemsPage type="freq" /> },

  { path: "/settings", name: "settings", component: <SettingsPage /> },
  { path: "/debug", name: "debug", component: <DebugPage /> },
  { path: "/debug/picktest", name: "debugPicktest", component: <DebugPickTest /> },
];

export function AppRouter(): JSX.Element {
  return <Switch>
    {/* Render the matched route's page component */}
    {APP_ROUTES.map(({ path, component }, key) => {
      if (!component) return null;
      return <Route key={key} exact={true} path={path}>
        <ErrorBoundary name={"router-" + key}>
          {component}
        </ErrorBoundary>
      </Route>;
    })}

    <Redirect from="/session" to="/review/session" exact />
    <Redirect from="/vocab/:slug" to="/vocabulary/:slug" />
    <Redirect from="/items" to="/items/wk" exact />
    <Redirect from="/items/freq" to="/items/frequency" exact />

    <Route path="*"><NotFoundPage /></Route>
  </Switch>;
}
