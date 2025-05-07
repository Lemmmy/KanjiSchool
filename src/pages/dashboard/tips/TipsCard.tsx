// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button } from "@comp/Button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

import { useAppSelector } from "@store";
import { setTip } from "@store/slices/settingsSlice.ts";
import { useDispatch } from "react-redux";

import { cn, lsSetNumber } from "@utils";

import { SimpleCard } from "@comp/SimpleCard.tsx";
import { dashboardCardBodyClass, dashboardCardClass } from "@pages/dashboard/sharedStyles.ts";
import { TIPS } from "./tips";

import Debug from "debug";
const debug = Debug("kanjischool:tips-card");

const mod = (n: number, m: number): number => ((n % m) + m) % m;

const TIP_COUNT = TIPS.length;

/** Advance the tip on app start. */
export function AdvanceTip(): React.ReactElement | null {
  const dispatch = useDispatch();
  const currentTip = useAppSelector(s => s.settings.tip);

  useEffect(() => {
    const next = mod(currentTip + 1, TIP_COUNT);

    debug("AdvanceTip setting tip from %d to %d", currentTip, next);

    dispatch(setTip(next));
    lsSetNumber("tip", next);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function TipsCard(): React.ReactElement {
  const dispatch = useDispatch();
  const rawTip = useAppSelector(s => s.settings.tip);
  const currentTip = mod(rawTip, TIP_COUNT);

  const changeTip = (tip: number) => {
    dispatch(setTip(tip));
    lsSetNumber("tip", tip);
  };
  const previousTip = () => changeTip(mod(currentTip - 1, TIP_COUNT));
  const nextTip = () => changeTip(mod(currentTip + 1, TIP_COUNT));

  return <SimpleCard
    title="Tip of the day"
    className={cn(dashboardCardClass, "flex-auto mt-md")}
    headClassName="pr-sm"
    bodyClassName={dashboardCardBodyClass}
    extraClassName="flex items-center h-full"

    // Prev/Next tip buttons
    extra={<>
      <Button variant="link" onClick={previousTip} className="border-0 mx-0 h-full">
        <ChevronLeft />Prev
      </Button>

      <Button variant="link" onClick={nextTip} className="border-0 mx-0 h-full">
        Next<ChevronRight />
      </Button>
    </>}
  >
    <p className="mt-0">
      {TIPS[currentTip] ?? "Error"}
    </p>
  </SimpleCard>;
}
