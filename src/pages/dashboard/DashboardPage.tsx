// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";
import { Row, Col, Menu } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { PageLayout } from "@layout/PageLayout";
import { useTopMenuOptions } from "@layout/nav/TopMenu";

import { RootState } from "@store";
import { useSelector } from "react-redux";

import { SessionResultsAlert } from "@pages/session/results/SessionResultsAlert";
import { showSessionAbandonModal } from "@pages/session/modals/SessionAbandonModal";

import { SummaryCard } from "./summary/SummaryCard";
import { LevelProgressCard } from "./level-progress/LevelProgressCard";
import { SummaryChartCard } from "./summary/SummaryChartCard";
import { SrsStagesCard } from "./srs-stages/SrsStagesCard";
import { NewUnlocksCard } from "./NewUnlocksCard";
import { CriticalConditionCard } from "./CriticalConditionCard";
import { ReviewForecastCard } from "./review-forecast/ReviewForecastCard";
import { KanjiProgressCard } from "./jlpt-joyo/KanjiProgressCard";
import { ReviewAccuracyCard } from "./ReviewAccuracyCard";
import { TipsCard } from "./tips/TipsCard";
import { ReviewHeatmapCard } from "./heatmap/ReviewHeatmapCard";
import { SubscriptionStatus } from "./SubscriptionStatus";

import { useBooleanSetting } from "@utils";

import useResizeObserver from "use-resize-observer";

export function DashboardPage(): JSX.Element {
  const ongoingSession = useSelector((s: RootState) => s.session.ongoing);

  const showLastSessionSummary = useBooleanSetting("dashboardLastSessionSummary");
  // const showReviewStatsRow = useBooleanSetting("dashboardReviewStatsRow");
  // const showJlptJoyoRow = useBooleanSetting("dashboardJlptJoyoRow");
  // const showLevelProgressRow = useBooleanSetting("dashboardLevelProgressRow");

  // Show an 'abandon session' button if there is an ongoing session
  const [,set, unset] = useTopMenuOptions();
  useEffect(() => {
    if (ongoingSession) {
      set(<>
        {/* Abandon session */}
        <Menu.Item key="top-abandon" danger onClick={() => showSessionAbandonModal()}>
          <DeleteOutlined />Abandon session
        </Menu.Item>
      </>);
    }

    return unset;
  }, [ongoingSession, set, unset]);

  const page = <PageLayout siteTitle="Dashboard" className="dashboard-page">
    <SubscriptionStatus />

    <DashboardTopRow />

    <Row gutter={16} className="dashboard-row">
      {/* Summary chart */}
      <Col span={24} lg={14}><SummaryChartCard /></Col>
      {/* SRS stage item count */}
      <Col span={24} lg={10}><SrsStagesCard /></Col>
    </Row>

    <Row gutter={16} className="dashboard-row">
      <Col span={24} xl={12} style={{ display: "flex", flexDirection: "column" }}>
        {/* Review heatmap */}
        <ReviewHeatmapCard />
        {/* Tip of the day */}
        <TipsCard />
      </Col>

      <Col span={24} xl={6} xxl={6}><CriticalConditionCard /></Col>
      <Col span={24} xl={6} xxl={6}><ReviewForecastCard /></Col>
    </Row>

    <Row gutter={16} className="dashboard-row">
      {/* Kanji progress */}
      <Col span={24} lg={12}><KanjiProgressCard /></Col>

      <Col span={24} lg={12} style={{ display: "flex", flexDirection: "column" }}>
        {/* Unlocked/burned items */}
        <Row gutter={16} className="unlocks-area">
          <Col span={24} xl={12}><NewUnlocksCard dateField="unlocked_at" /></Col>
          <Col span={24} xl={12}><NewUnlocksCard dateField="burned_at" /></Col>
        </Row>

        {/* Review accuracy */}
        <ReviewAccuracyCard />
      </Col>
    </Row>
  </PageLayout>;

  return <>
    {showLastSessionSummary && <SessionResultsAlert />}
    {page}
  </>;
}

function DashboardTopRow(): JSX.Element {
  // Couldn't find a nice CSS-only way to get the level progress overflow to
  // properly match the height of the summary card. So, measure the height of
  // the summary card, and force the level progress card to have that same
  // height.
  const { ref, height } = useResizeObserver<HTMLDivElement>();

  return <Row gutter={16} className="dashboard-row">
    {/* Summary */}
    <Col span={24} lg={16} xl={14}>
      <SummaryCard ref={ref} />
    </Col>

    {/* Level progress */}
    <Col span={24} lg={8} xl={10}>
      <LevelProgressCard height={height} />
    </Col>
  </Row>;
}
