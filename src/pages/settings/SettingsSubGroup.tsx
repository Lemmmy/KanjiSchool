// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { ReactNode } from "react";
import { MenuProps } from "antd";

import { SettingName } from "@utils/settings";
import { SettingBoolean } from "./SettingBoolean";
import { SettingInteger } from "./SettingInteger";
import { SettingDropdown } from "./SettingDropdown";
import { menuItemClass } from "./settingsStyles.ts";

export type MenuItem = Required<MenuProps>["items"][number];

export function booleanSetting(
  setting: SettingName<boolean>,
  title?: string,
  description?: ReactNode
): MenuItem {
  return {
    key: setting,
    className: menuItemClass,
    label: <SettingBoolean
      setting={setting}
      title={title}
      description={description}
    />
  };
}

export function integerSetting(
  setting: SettingName<number>,
  title?: string,
  description?: ReactNode
): MenuItem {
  return {
    key: setting,
    className: menuItemClass,
    label: <SettingInteger
      setting={setting}
      title={title}
      description={description}
    />
  };
}

export function dropdownSetting<T extends string>(
  setting: SettingName<T>,
  title?: string,
  description?: ReactNode,
  options: { label: string; value: T }[] = []
): MenuItem {
  return {
    key: setting,
    className: menuItemClass,
    label: <SettingDropdown
      setting={setting}
      title={title}
      description={description}
      options={options}
    />
  };
}

export function settingsSubGroup(
  title: string,
  icon: ReactNode | undefined,
  settings: MenuItem[]
): MenuItem {
  return {
    key: title,
    className: "!cursor-auto",
    label: <div className="flex gap-sm">{icon} {title}</div>,
    children: settings
  };
}

export function settingsGroup(
  title: string,
  settings: MenuItem[]
): MenuItem {
  return {
    key: title,
    type: "group",
    label: title,
    children: settings
  };
}
