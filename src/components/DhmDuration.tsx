// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";

import { pluralN } from "@utils";

interface Props {
  showYears?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  tooLow?: string;
  seconds?: number;
}

export function DhmDuration({
  showYears = false,
  showHours = true,
  showMinutes = true,
  tooLow = "A moment",
  seconds
}: Props): JSX.Element | null {
  const date = useMemo(() => {
    if (!seconds) return undefined;

    const y = Math.floor(seconds / 31536000);
    const d = showYears
      ? Math.floor(seconds / 86400) % 365
      : Math.floor(seconds / 86400);
    const h = Math.floor(seconds / 3600) % 24;
    const m = Math.floor(seconds / 60) % 60;

    let out = "";
    if (showYears && y > 0) out += `${pluralN(y, "year")}, `;
    if (d > 0)
      out += `${pluralN(d, "day")}, `;
    if ((showHours || (y === 0 && d === 0)) && h > 0)
      out += `${pluralN(h, "hour")}, `;
    if ((showMinutes || (y === 0 && d === 0 && h === 0)) && m > 0)
      out += `${pluralN(m, "minute")}`;

    out = out.trim().replace(/,$/, "");

    if (seconds < 60) {
      out = tooLow;
    }

    return out || undefined;
  }, [showYears, showHours, showMinutes, seconds, tooLow]);

  if (!date) return null;
  return <span className="dhm-duration">{date}</span>;
}
