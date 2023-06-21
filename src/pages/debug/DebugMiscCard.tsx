// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Card, Button, notification, Space } from "antd";

export function DebugMiscCard(): JSX.Element {
  return <Card title="Misc">
    <Space size="large">
      <Button onClick={() => notification.success({ message: "Test!" })}>
        Notification
      </Button>
    </Space>
  </Card>;
}
