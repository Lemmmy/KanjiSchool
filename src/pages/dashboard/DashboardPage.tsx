// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, lazy, Suspense } from "react";
import { Row, Col } from "antd";
import { DeleteOutlined } from "@ant-design/icons";

import { PageLayout } from "@layout/PageLayout";
import { useTopMenuOptions } from "@layout/nav/TopMenu";
import { SimpleCard } from "@comp/SimpleCard.tsx";

import { useAppSelector } from "@store";

import { LastSessionSummary } from "@pages/session/results/LastSessionSummary.tsx";
import { showSessionAbandonModal } from "@pages/session/modals/SessionAbandonModal";

import { SummaryCard } from "./summary/SummaryCard";
import { LevelProgressCard } from "./level-progress/LevelProgressCard";
import { SrsStagesCard } from "./srs-stages/SrsStagesCard";
import { ReviewForecastCard } from "./review-forecast/ReviewForecastCard";
import { KanjiProgressCard } from "./jlpt-joyo/KanjiProgressCard";
import { ReviewAccuracyCard } from "./ReviewAccuracyCard";
import { TipsCard } from "./tips/TipsCard";
import { SubscriptionStatus } from "./SubscriptionStatus";
import { OverleveledAssignments } from "./OverleveledAssignments";

import { useBooleanSetting } from "@utils";
import useResizeObserver from "use-resize-observer";


// Lazy load some of the cards that result in a large bundle size:
// UpcomingReviewsCard depends on Chart.JS
const UpcomingReviewsCard = lazy(() => import("./summary/upcoming-reviews-chart/UpcomingReviewsCard.tsx"));
// ReviewHeatmapCard depends on D3
const ReviewHeatmapCard = lazy(() => import("./heatmap/ReviewHeatmapCard.tsx"));
// CriticalConditionCard and NewUnlocksCard depend on the subject list components, which have a variety of windowing
// dependencies and a lot of other code
const CriticalConditionCard = lazy(() => import("./CriticalConditionCard.tsx"));
const NewUnlocksCard = lazy(() => import("./NewUnlocksCard.tsx"));

function DashboardPage(): React.ReactElement {
  const ongoingSession = useAppSelector(s => s.session.ongoing);

  const showLastSessionSummary = useBooleanSetting("dashboardLastSessionSummary");
  // const showReviewStatsRow = useBooleanSetting("dashboardReviewStatsRow");
  // const showJlptJoyoRow = useBooleanSetting("dashboardJlptJoyoRow");
  // const showLevelProgressRow = useBooleanSetting("dashboardLevelProgressRow");

  // Show an 'abandon session' button if there is an ongoing session
  const [, set, unset] = useTopMenuOptions();
  useEffect(() => {
    if (ongoingSession) {
      set([{
        key: "top-abandon",
        onClick: () => showSessionAbandonModal(),
        danger: true,
        icon: <DeleteOutlined />,
        label: "Abandon session"
      }]);
    }

    return unset;
  }, [ongoingSession, set, unset]);

  const page = <PageLayout siteTitle="Dashboard">
    <SubscriptionStatus />
    <OverleveledAssignments />

    <DashboardTopRow />

    <Row gutter={16} className="items-stretch [&>.ant-col]:mb-md">
      {/* Upcoming reviews chart */}
      <Col span={24} lg={14}>
        <Suspense fallback={<SimpleCard loading />}>
          <UpcomingReviewsCard />
        </Suspense>
      </Col>

      {/* SRS stage item count */}
      <Col span={24} lg={10}><SrsStagesCard /></Col>
    </Row>

    <Row gutter={16} className="items-stretch [&>.ant-col]:mb-md">
      <Col span={24} xl={12} style={{ display: "flex", flexDirection: "column" }}>
        {/* Review heatmap */}
        <Suspense fallback={<SimpleCard loading />}>
          <ReviewHeatmapCard />
        </Suspense>

        {/* Tip of the day */}
        <TipsCard />
      </Col>

      <Col span={24} xl={6} xxl={6}>
        {/* Critical condition items */}
        <Suspense fallback={<SimpleCard loading />}>
          <CriticalConditionCard />
        </Suspense>
      </Col>

      <Col span={24} xl={6} xxl={6}><ReviewForecastCard /></Col>
    </Row>

    <Row gutter={16} className="items-stretch [&>.ant-col]:mb-md -mb-md">
      {/* Kanji progress */}
      <Col span={24} lg={12}><KanjiProgressCard /></Col>

      <Col span={24} lg={12} style={{ display: "flex", flexDirection: "column" }}>
        {/* Unlocked/burned items */}
        <Row gutter={16}>
          {/* New unlocks in last 30d */}
          <Col span={24} xl={12} className="mb-md">
            <Suspense fallback={<SimpleCard loading />}>
              <NewUnlocksCard dateField="unlocked_at" />
            </Suspense>
          </Col>

          {/* Burned items in last 30d */}
          <Col span={24} xl={12} className="mb-md">
            <Suspense fallback={<SimpleCard loading />}>
              <NewUnlocksCard dateField="burned_at" />
            </Suspense>
          </Col>
        </Row>

        {/* Review accuracy */}
        <ReviewAccuracyCard />
      </Col>
    </Row>
  </PageLayout>;

  return <>
    {showLastSessionSummary && <LastSessionSummary />}
    {page}
  </>;
}

export const Component = DashboardPage;

function DashboardTopRow(): React.ReactElement {
  // Couldn't find a nice CSS-only way to get the level progress overflow to
  // properly match the height of the summary card. So, measure the height of
  // the summary card, and force the level progress card to have that same
  // height.
  const { ref, height } = useResizeObserver<HTMLDivElement>();

  return <Row gutter={16} className="items-stretch [&>.ant-col]:mb-md">
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
