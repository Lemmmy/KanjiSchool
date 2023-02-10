// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Switch } from "antd";

import { SettingName, setBooleanSetting, useBooleanSetting } from "@utils/settings";
import { SettingDescription } from "./SettingDescription";

interface Props {
  setting: SettingName<boolean>;
  title?: string;
  description?: ReactNode;
}

export function SettingBoolean({
  setting,
  title,
  description
}: Props): JSX.Element {
  const settingValue = useBooleanSetting(setting);

  function onChange(value: boolean) {
    setBooleanSetting(setting, value);
  }

  return <div
    className="menu-item-setting menu-item-setting-switch"
    onClick={() => onChange(!settingValue)}
  >
    <Switch
      // FIXME: This was double-firing change events (due to the click listener
      //        on the parent div); omitting this event is bad for a11y
      // onChange={onChange}
      checked={settingValue}
      style={{ marginRight: 12 }}
    />

    {title}

    <SettingDescription description={description} />
  </div>;
}
