// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Form, Row, Col } from "antd";

import { NormalizedSubjectType } from "@api";
import { ToggleButtonGroup, ToggleButtonGroupItem } from "./base/ToggleButtonGroup";

const ITEMS: ToggleButtonGroupItem<NormalizedSubjectType>[] = [
  { value: "radical",    label: "Radical",    className: "border-b-radical" },
  { value: "kanji",      label: "Kanji",      className: "border-b-kanji" },
  { value: "vocabulary", label: "Vocabulary", className: "border-b-vocabulary" },
];

export function TypePicker(props: any): JSX.Element {
  return <Row gutter={16}>
    <Col span={24}>
      <Form.Item name="types" label="Item type" className="mb-sm" {...props}>
        <ToggleButtonGroup
          className="type-picker"
          items={ITEMS}
        />
      </Form.Item>
    </Col>
  </Row>;
}
