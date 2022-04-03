// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback } from "react";
import classNames from "classnames";

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { countSessionItems } from "@session";
import { useBooleanSetting } from "@utils";

interface Props {
  responsive?: boolean;
}

export function SessionProgress({
  responsive = true
}: Props): JSX.Element {
  const doingLessons = useSelector((s: RootState) => s.session.doingLessons);
  const lessonCounter = useSelector((s: RootState) => s.session.lessonCounter);
  const sessionState = useSelector((s: RootState) => s.session.sessionState, shallowEqual);

  const showStarted = useBooleanSetting("sessionProgressStarted");
  const showSkipped = useBooleanSetting("sessionProgressSkipped");

  const { startedItems, finishedItems, skippedItems, totalItems } =
    countSessionItems(sessionState);

  // Use the lesson counter if we're doing lessons, otherwise use the session
  // item count
  const barFinished = doingLessons ? lessonCounter : finishedItems;

  const perc = useCallback((n: number) => ((n / totalItems) * 100) + "%",
    [totalItems]);

  const classes = classNames("session-progress-container", { responsive });

  return <div className={classes}>
    {/* Finished items */}
    <div className="bar-part bar-finished"
      style={{ width: perc(barFinished) }} />

    {/* Started items */}
    {showStarted && <div className="bar-part bar-started"
      style={{ width: perc(startedItems) }} />}

    {/* Skipped items */}
    {showSkipped && <div className="bar-part bar-skipped"
      style={{ width: perc(skippedItems) }} />}
  </div>;
}
