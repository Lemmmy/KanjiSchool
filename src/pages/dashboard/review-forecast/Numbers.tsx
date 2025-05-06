// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";
import { nts } from "@utils";

interface Props {
  reviews: number;
  cum: number;
  isNow?: boolean;
  className?: string;
  sepHeightClass?: string;
}

export function Numbers({
  reviews,
  cum,
  isNow,
  className,
  sepHeightClass = "h-[24px]"
}: Props): React.ReactElement {
  return <div className={classNames("flex items-center -mr-xs", className)}>
    {/* Review count (+n) */}
    <span className="inline-block w-[3em] text-right">
      <span className={isNow ? "text-green/60 light:text-green-6/60" : "text-desc"}>+</span>
      {nts(reviews)}
    </span>

    {/* Separator */}
    <span className={classNames("inline-block mx-sm w-px bg-white/20 light:bg-black/10", sepHeightClass)} />

    {/* Cumulative review count*/}
    <span className="inline-block w-[2em]">
      {nts(cum)}
    </span>
  </div>;
}
