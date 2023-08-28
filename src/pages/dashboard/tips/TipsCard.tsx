// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";
import { Card, Button } from "antd";
import { CaretLeftOutlined, CaretRightOutlined } from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@store";
import { setTip } from "@actions/SettingsActions";

import { lsSetNumber } from "@utils";

import { TIPS } from "./tips";

import Debug from "debug";
const debug = Debug("kanjischool:tips-card");

const mod = (n: number, m: number): number => ((n % m) + m) % m;

const TIP_COUNT = TIPS.length;

/** Advance the tip on app start. */
export function AdvanceTip(): JSX.Element | null {
  const dispatch = useDispatch();
  const currentTip = useSelector((s: RootState) => s.settings.tip);

  useEffect(() => {
    const next = mod(currentTip + 1, TIP_COUNT);

    debug("AdvanceTip setting tip from %d to %d", currentTip, next);

    dispatch(setTip(next));
    lsSetNumber("tip", next);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}

export function TipsCard(): JSX.Element {
  const dispatch = useDispatch();
  const rawTip = useSelector((s: RootState) => s.settings.tip);
  const currentTip = mod(rawTip, TIP_COUNT);

  const changeTip = (tip: number) => {
    dispatch(setTip(tip));
    lsSetNumber("tip", tip);
  };
  const previousTip = () => changeTip(mod(currentTip - 1, TIP_COUNT));
  const nextTip = () => changeTip(mod(currentTip + 1, TIP_COUNT));

  return <Card
    title="Tip of the day"
    className="h-full flex-auto mt-md [&>.ant-card-head]:pr-sm"

    // Prev/Next tip buttons
    extra={<>
      <Button type="link" onClick={previousTip} className="border-0 my-px mx-0 h-[54px]">
        <CaretLeftOutlined />Prev
      </Button>

      <Button type="link" onClick={nextTip} className="border-0 my-px mx-0 h-[54px]">
        Next<CaretRightOutlined />
      </Button>
    </>}
  >
    <p className="mt-0">
      {TIPS[currentTip] ?? "Error"}
    </p>
  </Card>;
}
