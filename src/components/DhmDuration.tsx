// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";

import { pluralN } from "@utils";

interface Props {
  short?: boolean;
  showYears?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  tooLow?: string;
  seconds?: number;
}

export function DhmDuration({
  short = false,
  showYears = false,
  showHours = true,
  showMinutes = true,
  tooLow = "A moment",
  seconds
}: Props): React.ReactElement | null {
  const date = useMemo(() => {
    if (!seconds) return undefined;

    const y = Math.floor(seconds / 31536000);
    const d = showYears
      ? Math.floor(seconds / 86400) % 365
      : Math.floor(seconds / 86400);
    const h = Math.floor(seconds / 3600) % 24;
    const m = Math.floor(seconds / 60) % 60;

    let out = "";
    if (showYears && y > 0)
      out += short ? `${y}y ` : `${pluralN(y, "year")}, `;
    if (d > 0)
      out += short ? `${d}d ` : `${pluralN(d, "day")}, `;
    if ((showHours || (y === 0 && d === 0)) && h > 0)
      out += short ? `${h}h ` : `${pluralN(h, "hour")}, `;
    if ((showMinutes || (y === 0 && d === 0 && h === 0)) && m > 0)
      out += short ? `${m}m ` : `${pluralN(m, "minute")}`;

    out = out.trim().replace(/,$/, "");

    if (seconds < 60) {
      out = tooLow;
    }

    return out || undefined;
  }, [short, showYears, showHours, showMinutes, seconds, tooLow]);

  if (!date) return null;
  return <span className="dhm-duration">{date}</span>;
}
