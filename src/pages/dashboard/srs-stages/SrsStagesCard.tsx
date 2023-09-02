// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";

import {
  StoredAssignment, StoredAssignmentMap, StoredSubjectMap,
  useAssignments, useSubjects, useUserLevel
} from "@api";

import { SrsStage } from "./SrsStage";
import { LockedSubjects } from "./Locked";
import { KnownSubjects } from "./KnownSubjects";
import { KnownSmall } from "./KnownSmall";

export type StageData = Record<number, number>;
interface KnownSubjectsData {
  radical: number;
  kanji: number;
  vocabulary: number;

  inProgress: number;
  passed: number;
  total: number;
}

// Count up the assignments by their SRS stage.
function countStages(
  assignments: StoredAssignmentMap | undefined
): [StageData, KnownSubjectsData] | undefined {
  if (!assignments) return;

  const stageData: StageData = {};
  const knownSubjects: KnownSubjectsData = {
    radical: 0, kanji: 0, vocabulary: 0,
    inProgress: 0, passed: 0, total: 0
  };

  for (const assignmentId in assignments) {
    const assignment = assignments[assignmentId];
    if (!assignment.data.internalShouldShow) continue;

    const stage = assignment.data.srs_stage;
    if (!stageData[stage]) stageData[stage] = 1;
    else stageData[stage] += 1;

    if (stage >= 1) {
      switch (assignment.data.subject_type) {
      case "radical": knownSubjects.radical++; break;
      case "kanji": knownSubjects.kanji++; break;
      case "vocabulary":
      case "kana_vocabulary":
        knownSubjects.vocabulary++;
        break;
      }

      if (stage >= 5) knownSubjects.passed++;
      else knownSubjects.inProgress++;
    }

    knownSubjects.total++;
  }

  return [stageData, knownSubjects];
}

// Count the locked subjects on this level
function countLocked(
  userLevel: number,
  assignments: StoredAssignmentMap | undefined,
  subjects: StoredSubjectMap | undefined
): number {
  if (!assignments || !subjects) return 0;

  // Map the subject IDs to assignments
  const subjectIdAssignmentMap: Record<number, StoredAssignment> = {};
  for (const assignmentId in assignments) {
    const assignment = assignments[assignmentId];
    // Ignore invalid assignments
    if (!assignment.data.internalShouldShow) continue;
    subjectIdAssignmentMap[assignment.data.subject_id] = assignment;
  }

  // Count the locked subjects on this level
  let locked = 0;
  for (const subjectId in subjects) {
    const subject = subjects[subjectId];
    // Ignore invalid subjects and subjects that are not on this level
    if (subject.data.level !== userLevel || subject.data.hidden_at) continue;

    // If there's no assignment or the assignment is locked, increment the
    // locked counter
    const ass = subjectIdAssignmentMap[subjectId];
    if (!ass || !ass.data.unlocked_at) locked++;
  }

  return locked;
}

export const baseStageClasses = "inline-block p-sm rounded transition-colors text-center leading-tight cursor-pointer";

export function SrsStagesCard(): JSX.Element | null {
  const userLevel = useUserLevel();
  const assignments = useAssignments();
  const subjects = useSubjects();

  const data = useMemo(() => countStages(assignments), [assignments]);
  const locked = useMemo(() => countLocked(userLevel, assignments, subjects),
    [userLevel, assignments, subjects]);

  if (!assignments || !subjects || !data) return null;
  const [stageData, knownSubjects] = data;

  return <div className="grid grid-cols-3 gap-xss text-black">
    <SrsStage stageData={stageData} min={1} max={4} /> {/* Apprentice */}
    <SrsStage stageData={stageData} min={5} max={6} /> {/* Guru */}
    <SrsStage stageData={stageData} min={7} /> {/* Master */}
    <SrsStage stageData={stageData} min={8} /> {/* Enlightened */}
    <SrsStage stageData={stageData} min={9} /> {/* Burned */}
    <LockedSubjects level={userLevel} count={locked} />

    <KnownSubjects type="radical" count={knownSubjects.radical} />
    <KnownSubjects type="kanji" count={knownSubjects.kanji} />
    <KnownSubjects type="vocabulary" count={knownSubjects.vocabulary} />

    {/* Small summaries */}
    <KnownSmall type="inProgress" name="In progress"
      count={knownSubjects.inProgress} />
    <KnownSmall type="passed" name="Passed" count={knownSubjects.passed} />
    <KnownSmall type="total" name="Total" count={knownSubjects.total} />
  </div>;
}


