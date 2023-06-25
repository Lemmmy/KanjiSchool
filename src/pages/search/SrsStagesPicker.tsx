// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Form, Select, Tag } from "antd";
import { CustomTagProps } from "rc-select/lib/BaseSelect";

import { usePalette, stringifySrsStage } from "@utils";
import { getReadableTextColor, SRS_STAGE_TO_PALETTE } from "@global/theme";

export function SrsStagesPicker({ ...props }: any): JSX.Element {
  const palette = usePalette();

  function tagRender({ label, value, closable, onClose }: CustomTagProps) {
    const colorKey = (typeof value === "number" ? SRS_STAGE_TO_PALETTE[value] : null) || "srsLesson";
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

  return <Form.Item label="SRS stages" name="srsStages" {...props}>
    <Select
      mode="multiple"
      allowClear
      tagRender={tagRender}
      listHeight={400}
    >
      {/* Show 'Locked' first */}
      <Select.Option value={10}>Locked</Select.Option>

      {/* Show the remaining 10 SRS stages (Lesson -> Burned) */}
      {Array(10).fill(0).map((_, i) =>
        <Select.Option key={i} value={i}>
          {stringifySrsStage(i)}
        </Select.Option>)}
    </Select>
  </Form.Item>;
}
