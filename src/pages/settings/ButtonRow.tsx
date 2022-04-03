// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Row, Col, Space } from "antd";
import { SettingsExportButton } from "./SettingsExportButton";
import { SettingsImportButton } from "./SettingsImportButton";
import { LogOutButton } from "./LogOutButton";

export function SettingsButtonRow(): JSX.Element {
  return <Row gutter={24} style={{ marginBottom: 24 }}>
    <Col>
      <Space wrap>
        <SettingsExportButton />
        <SettingsImportButton />
        <LogOutButton />
      </Space>
    </Col>
  </Row>;
}
