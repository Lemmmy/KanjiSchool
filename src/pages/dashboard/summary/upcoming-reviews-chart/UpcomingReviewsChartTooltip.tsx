// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { forwardRef, useMemo } from "react";
import { timeFormat } from "d3-time-format";
import { DeepNonNullable } from "utility-types";
import { nts, pluralN } from "@utils";
import { ChartDatum } from "@pages/dashboard/summary/upcoming-reviews-chart/data.ts";
import classNames from "classnames";

interface Props {
  datum: ChartDatum | null;
}

const dateFormat = timeFormat("%a %-d %b, %-I:%M %p");

export const ChartTooltip = forwardRef<HTMLDivElement, Props>(function ChartTooltip({ datum }, ref): JSX.Element {
  return <div
    ref={ref}
    className="absolute pointer-events-none bg-spotlight text-solidc px-md py-sm rounded shadow-lg hidden
      whitespace-nowrap z-50"
  >
    {datum && <TooltipInner datum={datum} />}
  </div>;
});

function TooltipInner({ datum: d }: DeepNonNullable<Props>): JSX.Element | null {
  const date = useMemo(() => new Date(d.date), [d.date]);
  const total = d.apprentice + d.guru + d.master + d.enlightened;

  return <>
    <div className="text-md font-bold">{dateFormat(date)}</div>
    <div className="text-sm text-green-4 text-center mt-xss mb-xs">{pluralN(total, "new review")}</div>

    <div className="flex flex-col gap-xs">
      <TooltipRow label="Cumulative" value={d.cumulative}
        className="bg-transparent border-2 border-solid border-reviews-cumulative border-box" />
      <TooltipRow label="Apprentice" value={d.apprentice}
        className="bg-srs-apprentice" />
      <TooltipRow label="Guru" value={d.guru}
        className="bg-srs-guru" />
      <TooltipRow label="Master" value={d.master}
        className="bg-srs-master" />
      <TooltipRow label="Enlightened" value={d.enlightened}
        className="bg-srs-enlightened" />
    </div>
  </>;
}

interface TooltipRowProps {
  label: string;
  value: number;
  className?: string;
}

function TooltipRow({ label, value, className }: TooltipRowProps): JSX.Element {
  const labelClass = classNames({ "text-desc": value <= 0, "font-bold": value > 0 });
  return <div className="flex items-center leading-none">
    <div className={classNames(className, "w-4 h-4 inline-block mr-sm rounded-sm")} />
    <span className="text-basec text-sm">{label}: <span className={labelClass}>{nts(value)}</span></span>
  </div>;
}
