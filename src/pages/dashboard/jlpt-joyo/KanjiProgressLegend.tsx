// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

export function KanjiProgressLegend(): JSX.Element {
  return <div className="hidden md:flex items-center text-sm text-desc">
    <LegendSquare className="bg-green" />
    <span className="mx-xs">Burned</span>

    <LegendSquare className="bg-lime" />
    <span className="ml-xs">Passed</span>
  </div>;
}

function LegendSquare({ className }: { className: string }): JSX.Element {
  return <span
    className={classNames(
      "inline-block w-[16px] h-[16px] whitespace-nowrap rounded-sm",
      className
    )}
  />;
}
