// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useCallback, useMemo, useContext, createContext, ReactNode } from "react";
import { Menu, Dropdown, MenuItemProps, MenuProps } from "antd";
import {
  MoreOutlined, SettingOutlined, BugOutlined, SearchOutlined, ReadOutlined,
  MacCommandOutlined, ReloadOutlined, GithubOutlined, UnorderedListOutlined
} from "@ant-design/icons";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import { useDispatch } from "react-redux";
import { setHotkeyHelpVisible } from "@actions/SettingsActions";

import { ConditionalLink } from "@comp/ConditionalLink";
import { MenuHotkey } from "@comp/MenuHotkey";

import { syncAll, useUsername } from "@api";

import { useOnlineStatus } from "@utils/hooks";
import { isLocalhost } from "@utils";

import Debug from "debug";
import { MenuUserInfo } from "./UserInfo";
import { ExtLink } from "@comp/ExtLink";
const debug = Debug("kanjischool:top-menu");

export type Opts = MenuProps["items"] | undefined;
export type SetMenuOptsFn = (opts: Opts) => void;

interface TopMenuCtxRes {
  options?: MenuProps["items"];
  setMenuOptions?: SetMenuOptsFn;
}

export const TopMenuContext = createContext<TopMenuCtxRes>({});

export function TopMenu(): JSX.Element {
  const dispatch = useDispatch();
  const openHotkeyHelp = useCallback(() =>
    dispatch(setHotkeyHelpVisible(true)), [dispatch]);

  // Used to show the user info on mobile
  const { sm } = useBreakpoint();

  const isOnline = useOnlineStatus();
  const username = useUsername();

  const ctxRes = useContext(TopMenuContext);
  const options = ctxRes?.options;

  const menuProps: MenuProps = useMemo(() => {
    const items: MenuProps["items"] = [
      // Mobile-only: User info
      !sm ? { key: "menu-user-info", label: <MenuUserInfo /> } : null,

      // Page-specified options
      ...(options ?? []),
      options ? { type: "divider" } : null,

      // Advanced search
      {
        key: "menu-advanced-search",
        className: "menu-item-has-hotkey",
        label: <ConditionalLink to="/search" matchTo aria-label="Advanced search">
          <SearchOutlined />Advanced search
          <MenuHotkey shortcut="Ctrl+Shift+K" />
        </ConditionalLink>
      },

      // Self-study (basically same as advanced search)
      {
        key: "menu-self-study",
        className: "menu-item-has-hotkey",
        label: <ConditionalLink to="/study" matchTo aria-label="Self-study">
          <ReadOutlined />Self-study
          <MenuHotkey shortcut="S" ifGroup="dashboard" />
        </ConditionalLink>
      },

      { type: "divider" },

      // Force sync all
      {
        key: "menu-sync",
        icon: <ReloadOutlined />, // TODO: does this render the same as having it in the label?
        label: "Re-sync all data",
        disabled: !isOnline,
        onClick: () => syncAll(true)
      },

      { type: "divider" },

      // Keyboard shortcuts
      {
        key: "menu-keyboard-shortcuts",
        className: "menu-item-has-hotkey",
        icon: <MacCommandOutlined />,
        label: <>
          Keyboard shortcuts
          <MenuHotkey shortcut="?" />
        </>,
        onClick: openHotkeyHelp
      },

      // Settings item
      {
        key: "menu-settings",
        icon: <SettingOutlined />,
        label: <ConditionalLink to="/settings" matchTo aria-label="Settings">
          Settings
        </ConditionalLink>
      },

      // Debug page (localhost only)
      (isLocalhost || username === "Lemmmy") ? {
        key: "menu-debug",
        icon: <BugOutlined />,
        label: <ConditionalLink to="/debug" matchTo aria-label="Debug">
          Debug
        </ConditionalLink>
      } : null,

      { type: "divider" },

      // GitHub links
      {
        key: "menu-github",
        icon: <GithubOutlined />,
        label: <ExtLink href="https://github.com/Lemmmy/KanjiSchool">GitHub</ExtLink>
      },
      {
        key: "menu-github-changelog",
        icon: <UnorderedListOutlined />,
        label: <ExtLink href="https://github.com/Lemmmy/KanjiSchool/commits">Changelog</ExtLink>
      },
      {
        key: "menu-github-issues",
        icon: <BugOutlined />,
        label: <ExtLink href="https://github.com/Lemmmy/KanjiSchool/issues">Report issues</ExtLink>
      }
    ];

    return {
      items: items.filter(i => i !== null)
    };
  }, [options, username, openHotkeyHelp, isOnline, sm]);

  return <Dropdown
    trigger={["click"]}
    overlayClassName="site-header-dropdown-overlay site-header-top-dropdown-menu"
    menu={menuProps}
  >
    <div className="site-header-element"><MoreOutlined /></div>
  </Dropdown>;
}

export const TopMenuProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [menuOptions, setMenuOptions] = useState<MenuProps["items"]>();

  const res: TopMenuCtxRes = useMemo(() => ({
    options: menuOptions, setMenuOptions
  }), [menuOptions]);

  return <TopMenuContext.Provider value={res}>
    {children}
  </TopMenuContext.Provider>;
};

export type TopMenuOptionsHookRes = [
  boolean, // isMobile
  SetMenuOptsFn, // set
  () => void, // unset
]

export function useTopMenuOptions(): TopMenuOptionsHookRes {
  const bps = useBreakpoint();
  const { setMenuOptions } = useContext(TopMenuContext);

  const set = useCallback((opts: Opts) => {
    debug("top menu options hook set");
    setMenuOptions?.(opts);
  }, [setMenuOptions]);

  const unset = useCallback(() => {
    debug("top menu options hook destructor");
    setMenuOptions?.(undefined);
  }, [setMenuOptions]);

  // Return whether the options are being shown
  return [!bps.md, set, unset];
}
