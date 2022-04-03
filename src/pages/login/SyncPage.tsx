// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Row, Col, Card, Progress, Alert } from "antd";

import { RootState } from "@store";
import { useSelector } from "react-redux";

import { PageLayout } from "@layout/PageLayout";

import { SyncSubjects } from "@global/sync/SyncSubjects";

import { CloudDisconnectedOutlined } from "@comp/icons/CloudDisconnectedOutlined";
import { useOnlineStatus } from "@utils";

export function SyncPage(): JSX.Element {
  const isOnline = useOnlineStatus();

  const progress = useSelector((s: RootState) => s.sync.subjectsProgress);
  const percent = progress
    ? Math.round(((progress.count / progress.total) * 100))
    : 0;

  return <>
    {/* Important: SyncSubjects handler */}
    <SyncSubjects />

    <PageLayout siteTitle="Downloading data" noHeader>
      <Row justify="center" align="middle" style={{ height: "100%" }}>
        <Col>
          <Card title="Downloading data" style={{ minWidth: 512 }}>
            {/* Offline warning */}
            {!isOnline && <Alert
              type="error"
              message="Currently offline"
              description="Restore network connectivity to continue setting up KanjiSchool."
              showIcon
              icon={<CloudDisconnectedOutlined />}
              style={{ margin: "0 auto 16px auto" }}
            />}

            {/* Progress bar */}
            {progress
              ? <>
                Subjects (<b>{progress.count}</b>/<b>{progress.total}</b>)
                <Progress percent={percent} />
              </>
              : <i>Starting...</i>}
          </Card>
        </Col>
      </Row>
    </PageLayout>
  </>;
}
