// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Form, Input, InputNumber } from "antd";

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
}: Props): JSX.Element {
  return <Form.Item label={label} {...props}>
    <Input.Group compact className="range-input-group">
      {/* Min */}
      <Form.Item name={minName} noStyle>
        <InputNumber
          placeholder={minPlaceholder}
          min={min} max={max}
        />
      </Form.Item>

      {/* Separator */}
      <Input
        className="range-input-split"
        placeholder="-"
        disabled
      />

      {/* Max */}
      <Form.Item name={maxName} noStyle>
        <InputNumber
          placeholder={maxPlaceholder}
          min={min} max={max}
        />
      </Form.Item>
    </Input.Group>
  </Form.Item>;
}
