// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Space, Card } from "antd";

import { PageLayout } from "@layout/PageLayout";

import { useCustomSessionCard } from "./DebugCustomSessionCard";
import { DebugSubjectsCard } from "./DebugSubjectsCard";
import { DebugMiscCard } from "./DebugMiscCard";
import { Heatmap } from "@pages/dashboard/heatmap/Heatmap";

export function DebugPage(): JSX.Element {
  const [customSessionCard, onAddSubject] = useCustomSessionCard();

  return <PageLayout siteTitle="Debug" title="Debug" className="debug-page">
    <Space direction="vertical" size="large">
      <Card>
        <div style={{ display: "flex", width: 1080, height: 640 }}>
          <Heatmap currentYearOnly={false} style={{ flex: 1 }} />
        </div>
      </Card>
      {customSessionCard}
      <DebugSubjectsCard onAddSubject={onAddSubject} />
      <DebugMiscCard />
    </Space>
  </PageLayout>;
}

