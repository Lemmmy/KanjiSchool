// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { ReactNode } from "react";
import { MenuProps } from "antd";

import { SettingName } from "@utils/settings";
import { SettingBoolean } from "./SettingBoolean";
import { SettingInteger } from "./SettingInteger";
import { SettingDropdown } from "./SettingDropdown";

export type MenuItem = Required<MenuProps>["items"][number];

export const booleanSetting = (
  setting: SettingName<boolean>,
  title?: string,
  description?: ReactNode
): MenuItem => ({
  key: setting,
  label: <SettingBoolean setting={setting} title={title} description={description} />
});

export const integerSetting = (
  setting: SettingName<number>,
  title?: string,
  description?: ReactNode
): MenuItem => ({
  key: setting,
  label: <SettingInteger setting={setting} title={title} description={description} />
});

export const dropdownSetting = <T extends string>(
  setting: SettingName<T>,
  title?: string,
  description?: ReactNode,
  options: { label: string; value: T }[] = []
): MenuItem => ({
    key: setting,
    label: <SettingDropdown setting={setting} title={title} description={description} options={options} />
  });

export const settingsSubGroup = (
  title: string,
  icon: ReactNode | undefined,
  settings: MenuItem[]
): MenuItem => ({
  key: title,
  label: <div className="flex gap-sm">{icon} {title}</div>,
  children: settings
});

export const settingsGroup = (
  title: string,
  settings: MenuItem[]
): MenuItem => ({
  key: title,
  type: "group",
  label: title,
  children: settings
});
