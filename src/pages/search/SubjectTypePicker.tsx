// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Form, Select } from "antd";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";

import { SubjectType } from "@api";

import { Tag } from "@comp/Tag";
import { getReadableTextColor } from "@global/theme";
import { normalizeVocabType, usePalette } from "@utils";

export function SubjectTypePicker({ ...props }: any): React.ReactElement {
  const palette = usePalette();

  function tagRender({ label, value, closable, onClose }: CustomTagProps) {
    const colorKey = normalizeVocabType(value as SubjectType);
    const color = palette[colorKey];
    const textColor = getReadableTextColor(palette, colorKey);

    return <Tag
      closable={closable}
      onClose={onClose}
      className="mr-1"
      style={{ backgroundColor: color, color: textColor }}
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
