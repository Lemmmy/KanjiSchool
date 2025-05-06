// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Space } from "antd";

import { PageLayout } from "@layout/PageLayout";

import { useCustomSessionCard } from "./DebugCustomSessionCard";
import { DebugSubjectsCard } from "./DebugSubjectsCard";
import { DebugMiscCard } from "./DebugMiscCard";
import { DebugPartsOfSpeechCard } from "./DebugPartsOfSpeechCard";

export function Component(): React.ReactElement {
  const [customSessionCard, onAddSubject] = useCustomSessionCard();

  return <PageLayout siteTitle="Debug" title="Debug" className="debug-page">
    <Space direction="vertical" size="large">
      {customSessionCard}
      <DebugSubjectsCard onAddSubject={onAddSubject} />
      <DebugPartsOfSpeechCard />
      <DebugMiscCard />
    </Space>
  </PageLayout>;
}

