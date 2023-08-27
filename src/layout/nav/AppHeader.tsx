// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Layout } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import * as api from "@api";

import { ConditionalLink } from "@comp/ConditionalLink";

import { OnlineStatus } from "./OnlineStatus";
import { SyncProgressBars } from "./progress";
import { ItemsDropdown } from "./ItemsDropdown";
import { Search } from "./search/Search";
import { UserInfo } from "./UserInfo";
import { TopMenu } from "./TopMenu";

const gitVersion: string = import.meta.env.VITE_GIT_VERSION;

export function AppHeader(): JSX.Element | null {
  // Hide certain features on mobile (TODO)
  const { sm, md } = useBreakpoint();

  if (!api.useIsLoggedIn()) return null;

  return <Layout.Header className="site-header">
    <ConditionalLink to="/" matchTo matchExact>
      <div className="site-header-brand">
        <span className="title">KanjiSchool</span>
        <span className="version">{gitVersion}</span>
      </div>
    </ConditionalLink>

    {/* Online status icon */}
    <OnlineStatus />
    {/* Various sync progresses */}
    <SyncProgressBars />

    {/* Spacer */}
    {md && <div className="site-header-spacer" />}

    {/* Non-mobile stuff */}
    {sm && <>
      {/* Items dropdown */}
      <ItemsDropdown />
      <div className="site-header-element-end-spacer" />

      {/* Search box */}
      <Search />
      {/* User info */}
      <UserInfo />
    </>}

    {/* Settings button and dropdown menu */}
    {!sm && <div className="site-header-spacer" />}
    <TopMenu />
  </Layout.Header>;
}
