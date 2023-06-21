// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";

import { Checkbox, Form, FormItemProps, InputNumber, Select } from "antd";
import { LessonOpts, ReviewOpts } from "@session/order/options";

export interface PresetSettingProps extends FormItemProps {
  name: keyof LessonOpts | keyof ReviewOpts;
  label: string;
  disabled?: boolean;
}

interface DropdownSettingProps extends PresetSettingProps {
  items: ({ value: string; label: ReactNode })[];
}
export function PresetDropdownSetting({
  name, label, disabled,
  items,
  ...props
}: DropdownSettingProps): JSX.Element {
  return <div className="preset-setting-item">
    <EnabledCheckbox name={name} disabled={disabled} {...props} />

    <Form.Item
      name={["opts", name]}
      label={label}
      {...props}
    >
      <Select
        disabled={disabled}
        options={items}
        dropdownMatchSelectWidth={false}
      />
    </Form.Item>
  </div>;
}

type CheckboxSettingProps = PresetSettingProps;
export function PresetCheckboxSetting({
  name, label, disabled,
  ...props
}: CheckboxSettingProps): JSX.Element {
  return <div className="preset-setting-item">
    <EnabledCheckbox name={name} disabled={disabled} {...props} />

    <Form.Item
      name={["opts", name]}
      label={label}
      valuePropName="checked"
      {...props}
    >
      <Checkbox disabled={disabled} />
    </Form.Item>
  </div>;
}

type NumberSettingProps = PresetSettingProps;
export function PresetNumberSetting({
  name, label, disabled,
  ...props
}: NumberSettingProps): JSX.Element {
  return <div className="preset-setting-item">
    <EnabledCheckbox name={name} disabled={disabled} {...props} />

    <Form.Item
      name={["opts", name]}
      label={label}
      {...props}
    >
      <InputNumber min={1} max={1000} disabled={disabled} />
    </Form.Item>
  </div>;
}

interface EnabledCheckboxProps {
  name: keyof LessonOpts | keyof ReviewOpts;
  disabled?: boolean;
}
export function EnabledCheckbox({
  name, disabled,
  ...props
}: EnabledCheckboxProps): JSX.Element {
  return <Form.Item
    className="enabled-checkbox"
    name={["enabledOpts", name]}
    valuePropName="checked"
    {...props}
  >
    <Checkbox disabled={disabled} />
  </Form.Item>;
}
