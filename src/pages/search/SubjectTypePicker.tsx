// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Form, Select, Tag } from "antd";
import { CustomTagProps } from "rc-select/lib/BaseSelect";

import { SubjectType } from "@api";

import { usePalette } from "@utils";
import { getReadableTextColor } from "@global/theme";

export function SubjectTypePicker({ ...props }: any): JSX.Element {
  const palette = usePalette();

  function tagRender({ label, value, closable, onClose }: CustomTagProps) {
    const colorKey = value as SubjectType;
    const color = palette[colorKey];
    const textColor = getReadableTextColor(palette, colorKey);

    return <Tag
      color={color}
      closable={closable} onClose={onClose}
      style={{ marginRight: 3, color: textColor }}
    >
      {label}
    </Tag>;
  }

  return <Form.Item label="Subject types" name="subjectTypes" {...props}>
    <Select
      mode="multiple"
      allowClear
      tagRender={tagRender}
    >
      <Select.Option value="radical">Radical</Select.Option>
      <Select.Option value="kanji">Kanji</Select.Option>
      <Select.Option value="vocabulary">Vocabulary</Select.Option>
    </Select>
  </Form.Item>;
}
