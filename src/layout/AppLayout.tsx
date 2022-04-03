// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, createContext } from "react";
import { Layout } from "antd";

import { AppRouter } from "@global/AppRouter";

import { AppHeader } from "./nav/AppHeader";
import { TopMenuProvider } from "./nav/TopMenu";
import { KeywordSearchProvider } from "@api/search/KeywordSearch";

export type SiteLayoutRef = HTMLDivElement | null;
export const SiteLayoutContext = createContext<SiteLayoutRef>(null);

export function AppLayout(): JSX.Element {
  const [siteLayout, setSiteLayout] = useState<HTMLDivElement | null>(null);

  return <Layout>
    <KeywordSearchProvider>
      <TopMenuProvider>
        <AppHeader />

        <SiteLayoutContext.Provider value={siteLayout}>
          <div
            className="ant-layout site-layout"
            tabIndex={0}
            onKeyDown={noSpace}
            ref={setSiteLayout}
          >
            <AppRouter />
          </div>
        </SiteLayoutContext.Provider>
      </TopMenuProvider>
    </KeywordSearchProvider>
  </Layout>;
}

function noSpace(e: React.KeyboardEvent<HTMLDivElement>) {
  // Prevent 'space' from scrolling the page (it is used as a keyboard
  // shortcut in subject pages)
  const classList = (e.target as HTMLDivElement).classList || [];
  if (e.key === " " && classList.contains("site-layout")) {
    e.preventDefault();
  }
}
