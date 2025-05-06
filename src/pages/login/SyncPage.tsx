// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Progress, Alert } from "antd";

import { useAppSelector } from "@store";

import { PageLayout } from "@layout/PageLayout";

import { SyncSubjects } from "@global/sync/SyncSubjects";

import { SimpleCard } from "@comp/SimpleCard.tsx";
import { CloudDisconnectedOutlined } from "@comp/icons/CloudDisconnectedOutlined";
import { useOnlineStatus } from "@utils";

export function SyncPage(): React.ReactElement {
  const isOnline = useOnlineStatus();

  const progress = useAppSelector(s => s.sync.subjectsProgress);
  const percent = progress
    ? Math.round(((progress.count / progress.total) * 100))
    : 0;

  return <>
    {/* Important: SyncSubjects handler */}
    <SyncSubjects />

    <PageLayout siteTitle="Downloading data" noHeader verticallyCentered>
      <SimpleCard title="Downloading data" className="w-full md:w-auto md:min-w-[512px]">
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
      </SimpleCard>
    </PageLayout>
  </>;
}
