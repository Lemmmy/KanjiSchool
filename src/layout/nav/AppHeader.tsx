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
import classNames from "classnames";

const gitVersion: string = import.meta.env.VITE_GIT_VERSION;

export const headerElementClass = classNames(
  "flex-0 h-header py-0 px-[20px] flex items-center justify-center",
  "border-0 border-l border-solid border-l-white/10",
  "bg-transparent transition-colors hover:bg-white/5 cursor-pointer"
);

export const dropdownOverlayClass = classNames(
  "fixed !top-header site-header-dropdown-overlay",
  "[&_.ant-dropdown-menu-item]:px-md [&_.ant-dropdown-menu-item]:py-xs",
  // See also the styles in index.css
);

export function AppHeader(): JSX.Element | null {
  // Hide certain features on mobile (TODO)
  const { sm, md } = useBreakpoint();

  if (!api.useIsLoggedIn()) return null;

  return <Layout.Header className="bg-header fixed inset-x-0 top-0 flex p-0 z-20">
    <ConditionalLink to="/" matchTo matchExact>
      <div className="mx-lg select-none whitespace-nowrap">
        <span className="text-[22.5px] text-white">
          KanjiSchool
        </span>
        <span className="text-[11px] block h-auto leading-none relative left-0 bottom-[2em] text-desc">
          {gitVersion}
        </span>
      </div>
    </ConditionalLink>

    {/* Online status icon */}
    <OnlineStatus />
    {/* Various sync progresses */}
    <SyncProgressBars />

    {/* Spacer */}
    {md && <div className="lg:flex-1" />}

    {/* Non-mobile stuff */}
    {sm && <>
      {/* Items dropdown */}
      <ItemsDropdown />
      <div className="h-header mr-md border-0 border-solid border-r border-r-white/10" />

      {/* Search box */}
      <Search />
      {/* User info */}
      <UserInfo />
    </>}

    {/* Settings button and dropdown menu */}
    {!sm && <div className="flex-1" />}
    <TopMenu />
  </Layout.Header>;
}
