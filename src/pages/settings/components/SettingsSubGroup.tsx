// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { ReactNode } from "react";
import { MenuProps } from "antd";

import { SettingName } from "@utils/settings";
import { SettingBoolean } from "./SettingBoolean.tsx";
import { SettingInteger } from "./SettingInteger.tsx";
import { DropdownOptions, SettingDropdown } from "./SettingDropdown.tsx";
import { menuItemClass } from "./settingsStyles.ts";

export type MenuItem = Required<MenuProps>["items"][number];

export function booleanSetting(
  setting: SettingName<boolean>,
  title?: string,
  description?: ReactNode,
  onChanged?: (value: boolean) => void
): MenuItem {
  return {
    key: setting,
    className: menuItemClass,
    label: <SettingBoolean
      setting={setting}
      title={title}
      description={description}
      onChanged={onChanged}
    />
  };
}

export function integerSetting(
  setting: SettingName<number>,
  title?: string,
  description?: ReactNode,
  onChanged?: (value: number) => void
): MenuItem {
  return {
    key: setting,
    className: menuItemClass,
    label: <SettingInteger
      setting={setting}
      title={title}
      description={description}
      onChanged={onChanged}
    />
  };
}

export function dropdownSetting<T extends string>(
  setting: SettingName<T>,
  title?: string,
  description?: ReactNode,
  options: DropdownOptions<T> = [],
  onChanged?: (value: T) => void
): MenuItem {
  return {
    key: setting,
    className: menuItemClass,
    label: <SettingDropdown
      setting={setting}
      title={title}
      description={description}
      options={options}
      onChanged={onChanged}
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
