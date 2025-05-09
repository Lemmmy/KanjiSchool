// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button, Space } from "antd";
import { globalNotification } from "@global/AntInterface.tsx";
import { showNearMatchNotification, showSrsNotification } from "@session";
import { SimpleCard } from "@comp/SimpleCard.tsx";

export function DebugMiscCard(): JSX.Element {
  return <SimpleCard title="Misc" extra="foo">
    <Space size="large">
      <Button onClick={() => globalNotification.success({ message: "Test!" })}>
        Notification
      </Button>
      <Button onClick={() => showSrsNotification(2, 1)}>
        SRS down
      </Button>
      <Button onClick={() => showSrsNotification(1, 2)}>
        SRS up
      </Button>
      <Button onClick={() => showNearMatchNotification("tets", "test")}>
        Near match
      </Button>
    </Space>
  </SimpleCard>;
}
