// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { HeatmapDay } from "./data";

import { isToday } from "date-fns";

import dayjs from "dayjs";
import { nts } from "@utils";

interface Props {
  day: HeatmapDay;
}

export function ReviewHeatmapTooltip({ day }: Props): JSX.Element {
  return <div className="flex flex-wrap gap-sm text-basec">
    <span className="whitespace-nowrap">
      {isToday(day.date)
        ? <b>Today</b>
        : dayjs(day.date).format("ll")}
    </span>
    <Num name="Lessons" n={day.lessons} />
    <Num name="Reviews" n={day.reviews} />
    <Num name="Upcoming reviews" n={day.future} />
  </div>;
}

interface NumProps {
  name: string;
  n: number;
}

function Num({ name, n }: NumProps): JSX.Element | null {
  if (n <= 0) return null;
  return <span className="whitespace-nowrap">
    {name}: <b>{nts(n)}</b>
  </span>;
}
