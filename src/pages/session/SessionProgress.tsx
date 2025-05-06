// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback } from "react";
import classNames from "classnames";

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import { countSessionItems } from "@session";
import { useBooleanSetting, useReducedMotion } from "@utils";

interface Props {
  className?: string;
  heightClassName?: string;
  barClassName?: string;
  barHeightClassName?: string;
}

export function SessionProgress({
  className,
  heightClassName = "h-[12px]",
  barClassName = "inline-block",
  barHeightClassName = heightClassName,
}: Props): React.ReactElement {
  const doingLessons = useAppSelector(s => s.session.doingLessons);
  const lessonCounter = useAppSelector(s => s.session.lessonCounter);
  const sessionState = useAppSelector(s => s.session.sessionState, shallowEqual);

  const showStarted = useBooleanSetting("sessionProgressStarted");
  const showSkipped = useBooleanSetting("sessionProgressSkipped");

  const { startedItems, finishedItems, skippedItems, totalItems } =
    countSessionItems(sessionState);

  // Use the lesson counter if we're doing lessons, otherwise use the session
  // item count
  const barFinished = doingLessons ? lessonCounter : finishedItems;

  const perc = useCallback((n: number) => ((n / totalItems) * 100) + "%",
    [totalItems]);

  const classes = classNames(
    "flex flex-1 mb-lg bg-white/4 light:bg-black/8 rounded-2xl overflow-hidden",
    heightClassName,
    className
  );

  const reducedMotion = useReducedMotion();
  const barClasses = classNames(
    barClassName,
    barHeightClassName,
    {
      "transition-all": !reducedMotion
    }
  );

  return <div className={classes}>
    {/* Finished items */}
    <div
      className={classNames(barClasses, "bg-primary")}
      style={{ width: perc(barFinished) }}
    />

    {/* Started items */}
    {showStarted && <div
      className={classNames(barClasses, "bg-primary/50 light:bg-blue-2")}
      style={{ width: perc(startedItems) }}
    />}

    {/* Skipped items */}
    {showSkipped && <div
      className={classNames(barClasses, "bg-orange/25 light:bg-orange-2")}
      style={{ width: perc(skippedItems) }}
    />}
  </div>;
}
