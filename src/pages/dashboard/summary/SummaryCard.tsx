// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { forwardRef } from "react";
import { Row, Card } from "antd";

import { useUser } from "@api";

import { LevelInfoRow } from "./LevelInfoRow";
import { RefreshButton } from "./RefreshButton";
import { SummaryMainCol } from "./SummaryMainCol";
import { ResumeSessionRow } from "./ResumeSessionRow";
import { useAvailableAssignments } from "./AvailableAssignments";

export const SummaryCard = forwardRef<HTMLDivElement>((_, ref) => {
  const user = useUser();

  // Get the available assignments shared between the lessons and reviews cols
  const available = useAvailableAssignments();

  return <div
    // Card doesn't have a forwardRef, so we have to wrap it in a div :/
    ref={ref}
  >
    <Card
      title={user ? "Summary for " + user.data.username : "Summary"}

      className="dashboard-summary-card"

      // Refresh button in top right of summary card, with a loading icon if they
      // are currently syncing
      extra={<RefreshButton />}
    >
      {/* Current level, time on level, etc. */}
      <LevelInfoRow />

      <Row className="summary-card-main">
        <SummaryMainCol type="lesson" available={available?.lessons} />
        <SummaryMainCol type="review" available={available?.reviews} />
      </Row>

      {/* If there is an ongoing session, show the resume/abandon buttons */}
      <ResumeSessionRow />
    </Card>
  </div>;
});
