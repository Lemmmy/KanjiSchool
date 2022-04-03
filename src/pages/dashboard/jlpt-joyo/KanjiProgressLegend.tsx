// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

export function KanjiProgressLegend(): JSX.Element {
  return <div className="kanji-progress-legend">
    <div className="legend-square legend-burned"></div>
    <span className="legend-label">Burned</span>

    <div className="legend-square legend-passed"></div>
    <span className="legend-label">Passed</span>
  </div>;
}
