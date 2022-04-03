// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useCallback, useMemo, useContext, createContext, FC, ReactNode } from "react";
import { Menu, Dropdown } from "antd";
import {
  MoreOutlined, SettingOutlined, BugOutlined, SearchOutlined, ReadOutlined,
  MacCommandOutlined, ReloadOutlined
} from "@ant-design/icons";

import { useDispatch } from "react-redux";
import { setHotkeyHelpVisible } from "@actions/SettingsActions";

import { ConditionalLink } from "@comp/ConditionalLink";
import { MenuHotkey } from "@comp/MenuHotkey";

import { syncAll, useUsername } from "@api";

import { useBreakpoint, useOnlineStatus } from "@utils/hooks";
import { isLocalhost } from "@utils";

import Debug from "debug";
import { MenuUserInfo } from "./UserInfo";
const debug = Debug("kanjischool:top-menu");

export type Opts = React.ReactNode | undefined;
export type SetMenuOptsFn = (opts: Opts) => void;

interface TopMenuCtxRes {
  options?: ReactNode;
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

  const menu = useMemo(() => (
    <Dropdown
      trigger={["click"]}
      overlayClassName="site-header-dropdown-overlay site-header-top-dropdown-menu"
      overlay={<Menu>
        {/* Mobile-only: User info */}
        {!sm && <MenuUserInfo />}

        {/* Page-specified options */}
        {options}
        {options && <Menu.Divider key="menu-divider" />}

        {/* Advanced search */}
        <Menu.Item key="menu-advanced-search" className="menu-item-has-hotkey">
          <ConditionalLink to="/search" matchTo aria-label="Advanced search">
            <SearchOutlined />Advanced search
            <MenuHotkey shortcut="Ctrl+Shift+K" />
          </ConditionalLink>
        </Menu.Item>

        {/* Self-study (basically same as advanced search) */}
        <Menu.Item key="menu-self-study" className="menu-item-has-hotkey">
          <ConditionalLink to="/study" matchTo aria-label="Self-study">
            <ReadOutlined />Self-study
            <MenuHotkey shortcut="S" ifGroup="dashboard" />
          </ConditionalLink>
        </Menu.Item>

        <Menu.Divider key="menu-divider-2" />

        {/* Force sync all */}
        <Menu.Item
          key="menu-sync"
          onClick={() => syncAll(true)}
          disabled={!isOnline}
        >
          <ReloadOutlined />Re-sync all data
        </Menu.Item>

        <Menu.Divider key="menu-divider-3" />

        {/* Keyboard shortcuts */}
        <Menu.Item
          key="menu-keyboard-shortcuts"
          className="menu-item-has-hotkey"
          onClick={openHotkeyHelp}
        >
          <MacCommandOutlined />Keyboard shortcuts
          <MenuHotkey shortcut="?" />
        </Menu.Item>

        {/* Settings item */}
        <Menu.Item key="menu-settings">
          <ConditionalLink to="/settings" matchTo aria-label="Settings">
            <SettingOutlined />Settings
          </ConditionalLink>
        </Menu.Item>

        {/* Debug page (localhost only) */}
        {(isLocalhost || username === "Lemmmy") && <Menu.Item key="menu-debug">
          <ConditionalLink to="/debug" matchTo aria-label="Debug">
            <BugOutlined />Debug
          </ConditionalLink>
        </Menu.Item>}
      </Menu>}
    >
      <div className="site-header-element"><MoreOutlined /></div>
    </Dropdown>
  ), [options, username, openHotkeyHelp, isOnline, sm]);

  return menu;
}

export const TopMenuProvider: FC = ({ children }) => {
  const [menuOptions, setMenuOptions] = useState<ReactNode>();

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

  // Return whether or not the options are being shown
  return [!bps.md, set, unset];
}
