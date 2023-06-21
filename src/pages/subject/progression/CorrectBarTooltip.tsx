// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

interface Props {
  percentage: number;
}

function getColorClass(percentage: number): string {
  if (percentage >= 90) return "green";
  else if (percentage >= 70) return "yellow";
  else if (percentage >= 40) return "orange";
  else return "red";
}

export function CorrectBarTooltip({ percentage }: Props): JSX.Element {
  const colorClass = getColorClass(percentage);

  return <div
    className={"correct-bar-tooltip " + colorClass}
    style={{ left: percentage + "%" }}
  >
    {/* Fake ant tooltip contents */}
    <div className="ant-tooltip ant-tooltip-placement-top">
      <div className="ant-tooltip-content">
        <div className="ant-tooltip-arrow">
          <span className={"ant-tooltip-arrow-content " + colorClass} />
        </div>

        {/* Percentage */}
        <div className={"ant-tooltip-inner " + colorClass} role="tooltip">
          {Math.round(percentage) + "%"}
        </div>
      </div>
    </div>
  </div>;
}
