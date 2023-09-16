// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode, useCallback, useState } from "react";
import { Input, InputNumber, Button } from "antd";

import { SettingName, setIntegerSetting, useIntegerSetting, validateIntegerSetting } from "@utils/settings";
import { SettingDescription } from "./SettingDescription";
import { menuItemSettingInner } from "./settingsStyles.ts";

interface Props {
  setting: SettingName<number>;
  title?: string;
  description?: ReactNode;
  onChanged?: (value: number) => void;
}

export function SettingInteger({
  setting,
  title,
  description,
  onChanged
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
    onChanged?.(numVal!);
  }, [isValid, numVal, setting, onChanged]);

  return <div className={menuItemSettingInner}>
    <div className="flex items-center gap-sm">
      {/* Input and save button */}
      <Input.Group compact className="inline-block w-auto">
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

      {/* Item title */}
      <div>
        {title}
      </div>
    </div>

    <SettingDescription description={description} />
  </div>;
}
