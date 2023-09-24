// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode, useCallback } from "react";
import { Switch } from "antd";

import { SettingName, setBooleanSetting, useBooleanSetting } from "@utils/settings";
import { SettingDescription } from "./SettingDescription.tsx";
import { menuItemSettingInner } from "./settingsStyles.ts";

interface Props {
  setting: SettingName<boolean>;
  title?: string;
  description?: ReactNode;
  onChanged?: (value: boolean) => void;
}

export function SettingBoolean({
  setting,
  title,
  description,
  onChanged
}: Props): JSX.Element {
  const settingValue = useBooleanSetting(setting);

  const onChange = useCallback((value: boolean) => {
    setBooleanSetting(setting, value);
    onChanged?.(value);
  }, [setting, onChanged]);

  return <div
    className={menuItemSettingInner}
    onClick={() => onChange(!settingValue)}
  >
    <div className="flex items-center gap-sm leading-none">
      <Switch
        // FIXME: This was double-firing change events (due to the click listener
        //        on the parent div); omitting this event is bad for a11y
        // onChange={onChange}
        checked={settingValue}
      />

      {title}
    </div>

    <SettingDescription description={description} />
  </div>;
}
