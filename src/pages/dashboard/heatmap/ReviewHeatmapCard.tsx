// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState } from "react";
import { Button, Card } from "antd";

import { Heatmap } from "./Heatmap";
import { HeatmapDay } from "./data";
import { ReviewHeatmapTooltip } from "./ReviewHeatmapTooltip";
import { ReviewHeatmapLegend } from "./ReviewHeatmapLegend";

import { useBreakpoint } from "@utils";

export function ReviewHeatmapCard(): JSX.Element {
  const [showAll, setShowAll] = useState(false);
  const [hoverDay, setHoverDay] = useState<HeatmapDay>();

  return <Card
    title="Review heatmap"
    className="dashboard-review-heatmap-card"

    // Show all button in top right of card
    extra={!showAll && <Button
      className="show-all"
      type="link"
      onClick={() => setShowAll(true)}
    >
      Show all
    </Button>}
  >
    <div className="heatmap-card-inner">
      <Heatmap currentYearOnly={!showAll} setHoverDay={setHoverDay} />
    </div>

    <CardFooter hoverDay={hoverDay} />
  </Card>;
}

interface FooterProps {
  hoverDay?: HeatmapDay;
}

function CardFooter({ hoverDay }: FooterProps): JSX.Element | null {
  const { sm } = useBreakpoint();
  if (!sm) return null; // Hide footer entirely on mobile

  return <div className="heatmap-card-footer">
    {hoverDay
      ? <ReviewHeatmapTooltip day={hoverDay} />
      : <span className="hover-hint">Hover over a day for more info</span>}
    <div className="spacer" />
    <ReviewHeatmapLegend />
  </div>;
}
