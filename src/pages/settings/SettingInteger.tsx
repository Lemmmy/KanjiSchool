// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode, useCallback, useState } from "react";
import { Input, InputNumber, Button } from "antd";

import { SettingName, setIntegerSetting, useIntegerSetting, validateIntegerSetting } from "@utils/settings";
import { SettingDescription } from "./SettingDescription";

interface Props {
  setting: SettingName<number>;
  title?: string;
  description?: ReactNode;
}

export function SettingInteger({
  setting,
  title,
  description
}: Props): JSX.Element {
  const settingValue = useIntegerSetting(setting);
  const [value, setValue] = useState<string | number>(settingValue);

  const numVal = value ? Number(value) : undefined;
  const isValid = numVal !== undefined
    && !isNaN(numVal)
    && validateIntegerSetting(setting, numVal);

  const onChange = useCallback((value: string | number | null) => {
    setValue(value ?? "");
  }, []);

  const onSave = useCallback(() => {
    if (!isValid) return;
    setIntegerSetting(setting, numVal!);
  }, [isValid, numVal, setting]);

  return <div className="menu-item-setting menu-item-setting-integer">
    <Input.Group compact>
      {/* Number input */}
      <InputNumber
        value={value}
        onChange={onChange}
        onPressEnter={onSave}
      />

      {/* Save button */}
      <Button
        type="primary"
        disabled={settingValue === Number(value) || !isValid}
        onClick={onSave}
      >
        Save
      </Button>
    </Input.Group>

    {title}

    <SettingDescription description={description} />
  </div>;
}
