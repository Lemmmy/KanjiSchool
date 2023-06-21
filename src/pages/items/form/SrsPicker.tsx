// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Form, Row, Col } from "antd";

import { ToggleButtonGroup, ToggleButtonGroupItem } from "./base/ToggleButtonGroup";

import { stringifySrsStage, getSrsStageBaseName } from "@utils";

const ITEMS: ToggleButtonGroupItem<string>[] =
  [10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(s => ({
    value: s.toString(),
    label: stringifySrsStage(s),
    className: getSrsStageBaseName(s).toLowerCase()
  }));

const ITEMS_NOT_ON_WK: ToggleButtonGroupItem<string>[] = [
  ...ITEMS,
  { value: "11", label: "Not on WK", className: "not-on-wk" }
];

interface Props {
  showNotOnWk?: boolean;
}

export function SrsPicker({ showNotOnWk, ...props }: Props): JSX.Element {
  return <Row gutter={16} style={{ marginBottom: 16 }}>
    <Col span={24}>
      <Form.Item name="srsStages" label="SRS stage" {...props}>
        <ToggleButtonGroup
          className="srs-picker"
          items={showNotOnWk ? ITEMS_NOT_ON_WK : ITEMS}
          hasBorderColors
          size="small"
        />
      </Form.Item>
    </Col>
  </Row>;
}
