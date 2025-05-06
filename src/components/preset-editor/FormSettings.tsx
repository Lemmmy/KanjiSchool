// Copyright (c) 2021-2025 Drew Edwards
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
}: DropdownSettingProps): React.ReactElement {
  return <div className="flex">
    <EnabledCheckbox name={name} disabled={disabled} {...props} />

    <Form.Item
      name={["opts", name]}
      label={label}
      className="mb-sm"
      {...props}
    >
      <Select
        disabled={disabled}
        options={items}
        popupMatchSelectWidth={false}
      />
    </Form.Item>
  </div>;
}

type CheckboxSettingProps = PresetSettingProps;
export function PresetCheckboxSetting({
  name, label, disabled,
  ...props
}: CheckboxSettingProps): React.ReactElement {
  return <div className="flex">
    <EnabledCheckbox name={name} disabled={disabled} {...props} />

    <Form.Item
      name={["opts", name]}
      label={label}
      className="mb-sm"
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
}: NumberSettingProps): React.ReactElement {
  return <div className="flex group">
    <EnabledCheckbox name={name} disabled={disabled} {...props} />

    <Form.Item
      name={["opts", name]}
      label={label}
      className="mb-sm group-last:mb-0"
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
}: EnabledCheckboxProps): React.ReactElement {
  return <Form.Item
    className="mr-sm"
    name={["enabledOpts", name]}
    valuePropName="checked"
    {...props}
  >
    <Checkbox disabled={disabled} />
  </Form.Item>;
}
