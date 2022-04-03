// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo, useEffect, useCallback } from "react";
import { Card } from "antd";

import { useUserLevel, useAssignments, useSubjects, useUserMaxLevel } from "@api";

import { analyze, isComplete } from "./analyze";
import { LevelProgressBars } from "./LevelProgressBars";
import { LevelProgressLegend } from "./LevelProgressLegend";

import { useBooleanSetting, useBreakpoint } from "@utils";

interface Props {
  height?: number;
}

export function LevelProgressCard({
  height
}: Props): JSX.Element {
  // Don't apply forced height on mobile
  const { sm } = useBreakpoint();

  // Automatically scroll to the bottom
  const scrollToBottom = useCallback(() => {
    // TODO: Unfortunately this is the most reliable way I could figure out
    const bodyEl = document.querySelector(".dashboard-level-progress-card .ant-card-body");
    if (!bodyEl) return;
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }, []);

  // Scroll to the bottom if the height changes
  useEffect(() => scrollToBottom, [scrollToBottom, height]);

  return <Card
    title="Level progress"
    extra={<LevelProgressLegend />}
    className="dashboard-level-progress-card"
    style={{
      // Apply forced height from Summary card except on mobile
      height: sm ? height : undefined
    }}
  >
    <LevelProgressCardInner scrollToBottom={scrollToBottom} />
  </Card>;
}

interface InnerProps {
  scrollToBottom: () => void;
}

function LevelProgressCardInner({ scrollToBottom }: InnerProps): JSX.Element {
  const userLevel = useUserLevel();
  const maxLevel = useUserMaxLevel();
  const assignments = useAssignments();
  const subjects = useSubjects();

  // Analyze the data for all the subjects:
  // - Group by level
  // - Group by subject type (radical, kanji, vocabulary)
  // - Split to SRS stages, and count the totals
  const levelData = useMemo(() => analyze(userLevel, maxLevel, assignments, subjects),
    [userLevel, maxLevel, assignments, subjects]);

  const includePassed = useBooleanSetting("dashboardLevelProgressPassed");

  // Scroll to the bottom if the data changes
  useEffect(() => scrollToBottom, [scrollToBottom, levelData, includePassed]);

  return <>{levelData.map(({ level, radicals, kanji, vocabulary }) => {
    // Don't show any level progress bars if the level is fully passed
    if (isComplete(radicals, includePassed)
      && isComplete(kanji, includePassed)
      && isComplete(vocabulary, includePassed)) {
      return null;
    }

    return <LevelProgressBars
      key={level}
      userLevel={userLevel}
      level={level}
      radicals={radicals}
      kanji={kanji}
      vocabulary={vocabulary}
      includePassed={includePassed}
      // endRef={userLevel === level ? endRef : undefined}
    />;
  })}</>;
}
