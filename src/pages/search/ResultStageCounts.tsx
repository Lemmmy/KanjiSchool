// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";

import { SearchResultSrsCounts } from "@api";
import { nts } from "@utils";

interface ResultStageCountsProps {
  counts: SearchResultSrsCounts;
}

const COUNT_ORDERS: (keyof SearchResultSrsCounts)[] =
  ["locked", "notStarted", "inProgress", "passed", "burned"];
const COUNT_NAMES: string[] =
  ["locked", "not started", "in progress", "passed", "burned"];

export function ResultStageCounts({ counts }: ResultStageCountsProps): JSX.Element {
  // Join the types of counts, in order, with commas
  const text = useMemo(() => COUNT_ORDERS
    .map((k, i) => counts[k] > 0
      ? `${nts(counts[k])} ${COUNT_NAMES[i]}`
      : undefined)
    .filter(s => s !== undefined)
    .join(", "), [counts]);

  return <span className="result-stage-counts">{text}</span>;
}
