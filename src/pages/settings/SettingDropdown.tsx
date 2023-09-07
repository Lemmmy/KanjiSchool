// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Select } from "antd";

import { SettingName, setStringSetting, useStringSetting } from "@utils/settings";
import { SettingDescription } from "./SettingDescription";
import { menuItemSettingInner } from "./settingsStyles.ts";

interface Props<T extends string> {
  setting: SettingName<T>;
  title?: string;
  description?: ReactNode;
  options: { label: string; value: T }[];
}

export function SettingDropdown<T extends string>({
  setting,
  title,
  description,
  options
}: Props<T>): JSX.Element {
  const settingValue = useStringSetting<T>(setting);

  function onChange(value: T) {
    setStringSetting(setting, value);
  }

  return <div className={menuItemSettingInner}>
    {title}
    <Select
      value={settingValue}
      options={options}
      onChange={onChange}
      className="ml-sm"
      popupMatchSelectWidth={false}
    />

    <SettingDescription description={description} />
  </div>;
}
