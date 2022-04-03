// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Form, Radio, Row, Col, Divider } from "antd";

export function ColorByPicker(props: any): JSX.Element {
  return <>
    {/* Header */}
    <Row gutter={16}>
      <Col span={24}><Divider orientation="left">Color by</Divider></Col>
    </Row>

    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={24}>

        <Form.Item name="colorBy" label="Color by" {...props}>
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
