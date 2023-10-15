// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState } from "react";
import { Button, Tooltip } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import classNames from "classnames";

import { Heatmap } from "./Heatmap";
import { HeatmapDay } from "./data";
import { ReviewHeatmapTooltip } from "./ReviewHeatmapTooltip";
import { ReviewHeatmapLegend } from "./ReviewHeatmapLegend";
import { openGetReviewsModal } from "../GetReviewsModal.tsx";
import { dashboardCardBodyClass, dashboardCardClass } from "../sharedStyles.ts";

import { SimpleCard } from "@comp/SimpleCard.tsx";

export default function ReviewHeatmapCard(): JSX.Element {
  const [showAll, setShowAll] = useState(false);
  const [hoverDay, setHoverDay] = useState<HeatmapDay>();

  return <SimpleCard
    title={<CardTitle />}
    className={classNames(dashboardCardClass, "!h-auto")}
    headClassName="pr-sm"
    bodyClassName={dashboardCardBodyClass}
    flush

    // Show all button in top right of card
    extra={!showAll && <Button
      className="border-0 my-px mx-0 h-[54px]"
      type="link"
      onClick={() => setShowAll(true)}
    >
      Show all
    </Button>}
  >
    <div className="flex justify-stretch max-h-[200px] overflow-auto p-md">
      <Heatmap currentYearOnly={!showAll} setHoverDay={setHoverDay} />
    </div>

    <CardFooter hoverDay={hoverDay} />
  </SimpleCard>;
}

function CardTitle(): JSX.Element {
  return <div className="flex items-center gap-sm">
    <span>Review heatmap</span>

    <Tooltip title="Review history may be incomplete or inaccurate. Click for more info.">
      <WarningOutlined
        className="text-yellow light:text-orange opacity-50 cursor-pointer"
        onClick={() => openGetReviewsModal()}
      />
    </Tooltip>
  </div>;
}

interface FooterProps {
  hoverDay?: HeatmapDay;
}

function CardFooter({ hoverDay }: FooterProps): JSX.Element | null {
  const { sm } = useBreakpoint();
  if (!sm) return null; // Hide footer entirely on mobile

  return <div
    className="flex gap-sm py-sm px-md bg-white/4 border-solid border-0 border-t border-t-split text-desc text-sm"
  >
    {hoverDay
      ? <ReviewHeatmapTooltip day={hoverDay} />
      : <span className="opacity-75">Hover over a day for more info</span>}
    <div className="flex-1" />
    <ReviewHeatmapLegend />
  </div>;
}
