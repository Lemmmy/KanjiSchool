// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";

export function LevelProgressLegend(): JSX.Element {
  return <div className="level-progress-legend">
    <div className="legend-square legend-passed"></div>
    <span className="legend-label">Passed</span>

    <div className="legend-square legend-appr4"></div>
    <div className="legend-square legend-appr3"></div>
    <div className="legend-square legend-appr2"></div>
    <div className="legend-square legend-appr1"></div>
    <Tooltip title="Apprentice">
      <span className="legend-label">Appr.</span>
    </Tooltip>

    <div className="legend-square legend-init"></div>
    <Tooltip title="Initiate">
      <span className="legend-label">Init.</span>
    </Tooltip>

    <div className="legend-square legend-locked"></div>
    <span className="legend-label">Locked</span>
  </div>;
}
