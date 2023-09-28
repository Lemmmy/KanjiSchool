// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";
import classNames from "classnames";

export function LevelProgressLegend(): JSX.Element {
  return <div className="hidden md:flex items-center text-sm text-desc">
    <LegendSquare className="bg-srs-passed rounded-sm" />
    <LegendLabel>Passed</LegendLabel>

    <LegendSquare className="bg-srs-apprentice-4 rounded-l-sm" />
    <LegendSquare className="bg-srs-apprentice-3" />
    <LegendSquare className="bg-srs-apprentice-2" />
    <LegendSquare className="bg-srs-apprentice-1 rounded-r-sm" />
    <Tooltip title="Apprentice">
      <LegendLabel>Appr.</LegendLabel>
    </Tooltip>

    <LegendSquare className="bg-srs-lesson rounded-sm" />
    <Tooltip title="Lesson">
      <LegendLabel>Less.</LegendLabel>
    </Tooltip>

    <LegendSquare className="bg-locked-stripes-dark light:bg-locked-stripes-light rounded-sm" />
    <LegendLabel>Locked</LegendLabel>
  </div>;
}

function LegendSquare({ className }: { className: string }): JSX.Element {
  return <span className={classNames("inline-block w-[16px] h-[16px] whitespace-nowrap", className)} />;
}

function LegendLabel({ children }: { children: React.ReactNode }): JSX.Element {
  return <span className="inline-block ml-xs mr-sm last:mr-0">{children}</span>;
}
