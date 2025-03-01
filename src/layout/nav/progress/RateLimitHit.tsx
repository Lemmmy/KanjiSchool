// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useEffect, useMemo, useState } from "react";

import { useAppSelector } from "@store";
import { HeaderProgress } from "./HeaderProgress.tsx";

import dayjs from "dayjs";

export function RateLimitHit(): JSX.Element | null {
  const apiRateLimitResetTime = useAppSelector(s => s.sync.apiRateLimitResetTime);
  const date = useMemo(() => apiRateLimitResetTime
    ? new Date(apiRateLimitResetTime)
    : undefined, [apiRateLimitResetTime]);

  if (!date) return null;

  return <HeaderProgress
    title={<span className="text-red">Rate limit exceeded</span>}
    description={<Countdown date={date} />}
    indeterminate
  />;
}

function Countdown({ date }: { date: Date }): JSX.Element {
  const [timeLeft, setTimeLeft] = useState(dayjs(date).diff(dayjs(), "second"));

  const update = useCallback(() => {
    const sec = dayjs(date).diff(dayjs(), "second");
    setTimeLeft(Math.max(sec, 1));
  }, [date]);

  useEffect(() => {
    const interval = setInterval(update, 500);
    return () => clearInterval(interval);
  }, [date, update]);

  return <>Retrying in {timeLeft}s&hellip;</>;
}
