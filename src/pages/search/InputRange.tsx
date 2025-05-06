// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Form, Input, Space, InputNumber } from "antd";

interface Props {
  label: ReactNode;
  minName: string;
  maxName: string;
  minPlaceholder?: string;
  maxPlaceholder?: string;
  min?: number;
  max?: number;
}

export function InputRange({
  label,
  minName, maxName,
  minPlaceholder = "Min", maxPlaceholder = "Max",
  min, max,
  ...props
}: Props): React.ReactElement {
  return <Form.Item label={label} {...props}>
    <Space.Compact className="!flex">
      {/* Min */}
      <Form.Item name={minName} noStyle>
        <InputNumber
          placeholder={minPlaceholder}
          min={min}
          max={max}
          className="flex-1 w-1/2"
        />
      </Form.Item>

      {/* Separator */}
      <Input
        className="flex-0 !w-[32px] text-center pointer-events-none"
        placeholder="-"
        disabled
      />

      {/* Max */}
      <Form.Item name={maxName} noStyle>
        <InputNumber
          placeholder={maxPlaceholder}
          min={min}
          max={max}
          className="flex-1 w-1/2"
        />
      </Form.Item>
    </Space.Compact>
  </Form.Item>;
}
