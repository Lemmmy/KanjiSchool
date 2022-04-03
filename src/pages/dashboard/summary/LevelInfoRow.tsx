// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import { Tooltip } from "antd";

import {
  useUser, useSubjects, useLevelProgressions,
  ApiUser, StoredSubjectMap, ApiLevelProgressionMap
} from "@api";

import { Streak } from "./Streak";

import { DhmDuration } from "@comp/DhmDuration";
import dayjs from "dayjs";

import { useBreakpoint } from "@utils";

interface Data {
  startDate: Date;
  startDateSeconds?: number;
  timeOnLevel?: number;
}

function getData(
  user?: ApiUser,
  subjects?: StoredSubjectMap,
  levelProgressions?: ApiLevelProgressionMap
): Data | undefined {
  if (!user || !subjects || !levelProgressions)
    return undefined;

  const now = dayjs();

  // Calculate the start date and days ago
  const startDate = new Date(user.data.started_at || new Date());
  const startDateSeconds = now.diff(startDate, "seconds");

  // Calculate the time spent on the current level
  const userLevel = user.data.level;
  const levelProgression = Object.values(levelProgressions)
    .find(p => p.data.level === userLevel);
  const timeOnLevel = levelProgression?.data?.started_at
    ? now.diff(levelProgression.data.started_at, "seconds") : undefined;

  return {
    startDate,
    startDateSeconds,
    timeOnLevel
  };
}

export function LevelInfoRow(): JSX.Element {
  const user = useUser();
  const maxLevel = user?.data.subscription.max_level_granted || 3;
  const subjects = useSubjects();
  const levelProgressions = useLevelProgressions();

  const { xl } = useBreakpoint();

  const data = useMemo(() => getData(user, subjects, levelProgressions),
    [user, subjects, levelProgressions]);

  return <div className="level-info-row">
    {user !== undefined && (
      <div className="level-info-part">
        <span className="label">Level: </span>
        {Math.min(user.data.level, maxLevel)} / {maxLevel}
      </div>
    )}

    {(user?.data.level || 1) <= maxLevel && <div className="level-info-part">
      <span className="label">Time on level: </span>
      {data?.timeOnLevel !== undefined
        ? <DhmDuration seconds={data.timeOnLevel} showYears />
        : <span className="not-started">Not started yet</span>}
    </div>}

    {xl && data?.startDate !== undefined && data?.startDateSeconds !== undefined && (
      <Tooltip title={data.startDate.toLocaleString()}>
        <div className="level-info-part">
          <span className="label">Signed up: </span>
          <DhmDuration
            seconds={data.startDateSeconds}
            showYears
            showHours={false}
            showMinutes={false}
          /> ago
        </div>
      </Tooltip>
    )}

    <Streak />
  </div>;
}
