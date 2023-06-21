// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { StoredSubjectMap, StoredAssignmentMap, StoredAssignment } from "@api";
import { JoyoGrades, JlptLevels } from "@data";

export interface DataPart {
  total: number;
  percentage: number;
  locked: number;
  inProgress: number;
  passed: number;
  burned: number;
}

export type JoyoParts = Record<JoyoGrades, DataPart>;
export type JlptParts = Record<JlptLevels, DataPart>;

export interface AnalyzedData {
  joyo: JoyoParts;
  joyoTotals: DataPart;
  jlpt: JlptParts;
  jlptTotals: DataPart;
}

const p = () => ({ total: 0, percentage: 0, locked: 0, inProgress: 0, passed: 0, burned: 0 });

function setPercentage(part: DataPart, totals: DataPart) {
  const total = part.locked + part.inProgress + part.passed + part.burned;
  const percPart = part.passed + part.burned;
  const perc = (percPart / total) * 100;
  part.total = total;
  part.percentage = perc;

  totals.total += total;
  totals.percentage += percPart;
  totals.locked += part.locked;
  totals.inProgress += part.inProgress;
  totals.passed += part.passed;
  totals.burned += part.burned;
}

function incr(
  joyo: DataPart | undefined,
  jlpt: DataPart | undefined,
  key: keyof DataPart
) {
  if (joyo) joyo[key]++;
  if (jlpt) jlpt[key]++;
}

export function analyze(
  subjects: StoredSubjectMap | undefined,
  assignments: StoredAssignmentMap | undefined
): AnalyzedData | undefined {
  if (!subjects || !assignments) return undefined;

  const joyo: JoyoParts = { 1: p(), 2: p(), 3: p(), 4: p(), 5: p(), 6: p(), 9: p() };
  const jlpt: JlptParts = { 1: p(), 2: p(), 3: p(), 4: p(), 5: p() };

  // Map subject IDs to assignments, for faster lookup
  const subjectIdAssignmentMap: Record<number, StoredAssignment> = {};
  for (const assignmentId in assignments) {
    const assignment = assignments[assignmentId];
    // Ignore invalid or non-kanji assignments
    if (assignment.data.hidden || assignment.data.subject_type !== "kanji")
      continue;
    subjectIdAssignmentMap[assignment.data.subject_id] = assignment;
  }

  // For each kanji subject, figure out its state and increment the counters
  for (const subjectId in subjects) {
    const subject = subjects[subjectId];
    // Ignore invalid or non-kanji subjects
    if (subject.data.hidden_at || subject.object !== "kanji") continue;
    // Ignore subjects that don't have Jisho data
    const { jisho } = subject.data;
    if (!jisho) continue;

    const assignment = subjectIdAssignmentMap[subject.id];
    const joyoPart = joyo[jisho.joyo];
    const jlptPart = jlpt[jisho.jlpt];

    // Increment the appropriate column counters based on the assignment state
    if (!assignment || !assignment.data.unlocked_at) {
      incr(joyoPart, jlptPart, "locked");
    } else if (assignment.data.burned_at || assignment.data.srs_stage >= 9) {
      incr(joyoPart, jlptPart, "burned");
    } else if (assignment.data.passed_at || assignment.data.srs_stage >= 5) {
      incr(joyoPart, jlptPart, "passed");
    } else {
      incr(joyoPart, jlptPart, "inProgress");
    }
  }

  // Finally, calculate the percentage of assignments that are 'passed' or
  // higher, and sum up the totals
  const joyoTotals = p();
  for (const part in joyo) {
    setPercentage(joyo[part as unknown as JoyoGrades], joyoTotals);
  }

  const jlptTotals = p();
  for (const part in jlpt) {
    setPercentage(jlpt[part as unknown as JlptLevels], jlptTotals);
  }

  return { joyo, joyoTotals, jlpt, jlptTotals };
}
