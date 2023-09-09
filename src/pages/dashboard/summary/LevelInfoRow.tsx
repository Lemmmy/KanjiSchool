// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import { Tooltip } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import { ApiLevelProgressionMap, ApiUser, StoredSubjectMap, useLevelProgressions, useSubjects, useUser } from "@api";

import { LevelInfoRowPart } from "./LevelInfoRowPart.tsx";
import { Streak } from "./Streak";

import { DhmDuration } from "@comp/DhmDuration";
import dayjs from "dayjs";

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

  return <div
    className="bg-[#303030] border-0 border-solid border-y border-y-[#303030] flex flex-row gap-px flex-wrap
      light:bg-[#e0e0e0] light:border-y-[#e0e0e0]"
  >
    {user !== undefined && (
      <LevelInfoRowPart label="Current level">
        {Math.min(user.data.level, maxLevel)} / {maxLevel}
      </LevelInfoRowPart>
    )}

    {(user?.data.level || 1) <= maxLevel && (
      <LevelInfoRowPart label="Time on level">
        {data?.timeOnLevel !== undefined
          ? <DhmDuration seconds={data.timeOnLevel} showYears short={!xl} />
          : <span className="text-desc-c/35 italic">Not started yet</span>}
      </LevelInfoRowPart>
    )}

    {xl && data?.startDate !== undefined && data?.startDateSeconds !== undefined && (
      <Tooltip title={data.startDate.toLocaleString()}>
        <LevelInfoRowPart label="Started">
          <DhmDuration
            seconds={data.startDateSeconds}
            showYears
            showHours={false}
            showMinutes={false}
          /> ago
        </LevelInfoRowPart>
      </Tooltip>
    )}

    <Streak />
  </div>;
}
