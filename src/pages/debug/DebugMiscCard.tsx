// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button } from "@comp/Button";
import { SimpleCard } from "@comp/SimpleCard.tsx";
import { globalNotification } from "@global/AntInterface.tsx";
import { showNearMatchNotification, showSrsNotification } from "@session";
import { Button as AntButton, Space } from "antd";
import { useState } from "react";
export function DebugMiscCard(): React.ReactElement {
  const [disabled, setDisabled] = useState(false);

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

    <div>
      <input type="checkbox" checked={disabled} onChange={() => setDisabled(!disabled)} />
      <label>Disabled</label>
    </div>

    {/* Ant Design Buttons */}
    <Space direction="vertical" size="middle" className="w-full mb-8">
      <div className="text-sm font-medium mb-2">Ant Design Buttons</div>
      <Space wrap>
        <AntButton disabled={disabled}>Default</AntButton>
        <AntButton disabled={disabled} type="primary">Primary</AntButton>
        <AntButton disabled={disabled} type="link">Link</AntButton>
        <AntButton disabled={disabled} danger type="link">Danger Link</AntButton>
        <AntButton disabled={disabled} danger>Danger</AntButton>
        <AntButton disabled={disabled} danger type="primary">Danger Primary</AntButton>
      </Space>
      <Space wrap>
        <AntButton disabled={disabled} size="small">Small</AntButton>
        <AntButton disabled={disabled} size="small" type="primary">Small Primary</AntButton>
        <AntButton disabled={disabled} size="small" type="link">Small Link</AntButton>
        <AntButton disabled={disabled} size="small" danger type="link">Small Danger Link</AntButton>
        <AntButton disabled={disabled} size="small" danger>Small Danger</AntButton>
        <AntButton disabled={disabled} size="small" danger type="primary">Small Danger Primary</AntButton>
      </Space>
      <Space wrap>
        <AntButton disabled={disabled} size="large">Large</AntButton>
        <AntButton disabled={disabled} size="large" type="primary">Large Primary</AntButton>
        <AntButton disabled={disabled} size="large" type="link">Large Link</AntButton>
        <AntButton disabled={disabled} size="large" danger type="link">Large Danger Link</AntButton>
        <AntButton disabled={disabled} size="large" danger>Large Danger</AntButton>
        <AntButton disabled={disabled} size="large" danger type="primary">Large Danger Primary</AntButton>
      </Space>
    </Space>

    {/* New Button Component */}
    <Space direction="vertical" size="middle" className="w-full">
      <div className="text-sm font-medium mb-2">New Button Component</div>
      <Space wrap>
        <Button disabled={disabled}>Default</Button>
        <Button disabled={disabled} variant="primary">Primary</Button>
        <Button disabled={disabled} variant="link">Link</Button>
        <Button disabled={disabled} danger variant="link">Danger Link</Button>
        <Button disabled={disabled} danger>Danger</Button>
        <Button disabled={disabled} danger variant="primary">Danger Primary</Button>
      </Space>
      <Space wrap>
        <Button disabled={disabled} size="small">Small</Button>
        <Button disabled={disabled} size="small" variant="primary">Small Primary</Button>
        <Button disabled={disabled} size="small" variant="link">Small Link</Button>
        <Button disabled={disabled} size="small" danger variant="link">Small Danger Link</Button>
        <Button disabled={disabled} size="small" danger>Small Danger</Button>
        <Button disabled={disabled} size="small" danger variant="primary">Small Danger Primary</Button>
      </Space>
      <Space wrap>
        <Button disabled={disabled} size="large">Large</Button>
        <Button disabled={disabled} size="large" variant="primary">Large Primary</Button>
        <Button disabled={disabled} size="large" variant="link">Large Link</Button>
        <Button disabled={disabled} size="large" danger variant="link">Large Danger Link</Button>
        <Button disabled={disabled} size="large" danger>Large Danger</Button>
        <Button disabled={disabled} size="large" danger variant="primary">Large Danger Primary</Button>
      </Space>
    </Space>
  </SimpleCard>;
}
