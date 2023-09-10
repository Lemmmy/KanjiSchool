// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Card, Progress, Alert } from "antd";

import { useAppSelector } from "@store";

import { PageLayout } from "@layout/PageLayout";

import { SyncSubjects } from "@global/sync/SyncSubjects";

import { CloudDisconnectedOutlined } from "@comp/icons/CloudDisconnectedOutlined";
import { useOnlineStatus } from "@utils";

export function SyncPage(): JSX.Element {
  const isOnline = useOnlineStatus();

  const progress = useAppSelector(s => s.sync.subjectsProgress)
  const percent = progress
    ? Math.round(((progress.count / progress.total) * 100))
    : 0;

  return <>
    {/* Important: SyncSubjects handler */}
    <SyncSubjects />

    <PageLayout siteTitle="Downloading data" noHeader verticallyCentered>
      <Card title="Downloading data" className="w-full md:w-auto md:min-w-[512px]">
        {/* Offline warning */}
        {!isOnline && <Alert
          type="error"
          message="Currently offline"
          description="Restore network connectivity to continue setting up KanjiSchool."
          showIcon
          icon={<CloudDisconnectedOutlined />}
          className="mx-auto mb-4"
        />}

        {/* Progress bar */}
        {progress
          ? <>
            Subjects (<b>{progress.count}</b>/<b>{progress.total}</b>)
            <Progress percent={percent} />
          </>
          : <i>Starting...</i>}
      </Card>
    </PageLayout>
  </>;
}
