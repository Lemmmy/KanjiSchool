// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { ComponentType, ReactNode } from "react";
import { Menu } from "antd";

import { SettingName } from "@utils/settings";
import { SettingBoolean } from "./SettingBoolean";
import { SettingInteger } from "./SettingInteger";
import { SettingDropdown } from "./SettingDropdown";

export interface SettingDesc<T, P = any> {
  component: ComponentType<P & {
    setting: SettingName<T>;
    title?: string;
    description?: ReactNode;
  }>;

  setting: SettingName<T>;
  title?: string;
  description?: ReactNode;
  additionalProps?: P;
}

export type GroupItem<T> = SettingDesc<T> | ReactNode;

export const booleanSetting = (
  setting: SettingName<boolean>,
  title?: string,
  description?: ReactNode
): SettingDesc<boolean> =>
  ({ component: SettingBoolean, setting, title, description });

export const integerSetting = (
  setting: SettingName<number>,
  title?: string,
  description?: ReactNode
): SettingDesc<number> =>
  ({ component: SettingInteger, setting, title, description });

export const dropdownSetting = <T extends string>(
  setting: SettingName<T>,
  title?: string,
  description?: ReactNode,
  options: { label: string; value: T }[] = []
): SettingDesc<T> =>
    ({ component: SettingDropdown, setting, title, description, additionalProps: { options } });

export function getSettingsGroup(
  title: string,
  icon: ReactNode | undefined,
  settings: GroupItem<any>[]
): JSX.Element {
  return <Menu.SubMenu
    key={"sub-" + title}
    icon={icon}
    title={title}
  >
    {/* Render each setting */}
    {settings.map(s => (
      s && typeof s === "object" && "setting" in s
        ? (
          <Menu.Item key={`${title}/${s.setting}`}>
            {React.createElement(s.component, {
              setting: s.setting,
              title: s.title || s.setting,
              description: s.description,
              ...s.additionalProps
            })}
          </Menu.Item>
        )
        : s // Render a ReactNode directly
    ))}
  </Menu.SubMenu>;
}
