// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Form, Radio, Row, Col } from "antd";

import { ItemsConfigFormDivider } from "./base/ItemsConfigFormDivider.tsx";

export function ColorByPicker(props: any): React.ReactElement {
  return <>
    {/* Header */}
    <Row gutter={16}>
      <Col span={24}><ItemsConfigFormDivider label="Color by" /></Col>
    </Row>

    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={24}>

        <Form.Item name="colorBy" label="Color by" className="mb-sm" {...props}>
          <Radio.Group
            buttonStyle="solid"
            optionType="button"
          >
            <Radio.Button value="type">Item type</Radio.Button>
            <Radio.Button value="srs">SRS stage</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </Col>
    </Row>
  </>;
}
