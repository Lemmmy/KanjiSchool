// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

interface Props {
  percentage: number;
}

function getColorClass(percentage: number): string {
  if (percentage >= 90) return "bg-green-6 light:bg-green-4";
  else if (percentage >= 70) return "bg-yellow-6 light:bg-yellow-5";
  else if (percentage >= 40) return "bg-orange-6 light:bg-orange-5";
  else return "bg-red-6";
}

export function CorrectBarTooltip({ percentage }: Props): JSX.Element {
  const colorClass = getColorClass(percentage);

  return <div
    className="absolute -top-[30px] select-none z-50"
    style={{ left: percentage + "%" }}
  >
    <div
      className={classNames(
        "relative -left-1/2 rounded whitespace-nowrap opacity-100 hover:opacity-50 transition-opacity shadow-md",
        colorClass
      )}
    >
      {/* Tooltip arrow */}
      <div
        className={classNames(
          "absolute left-1/2 bottom-0 w-[16px] h-[8px] clip-path-arrow-b -translate-x-1/2 translate-y-full rotate-180",
          colorClass
        )}
      />

      {/* Percentage */}
      <div className="text-sm text-center py-xss px-xs" role="tooltip">
        {Math.round(percentage) + "%"}
      </div>
    </div>
  </div>;
}
