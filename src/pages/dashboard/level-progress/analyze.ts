// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { StoredAssignmentMap, StoredAssignment, StoredSubjectMap, ApiSubject } from "@api";

// Locked, Lesson, Appr I, Appr II, Appr III, Appr IV, Passed, Total,
// All have PassedAt
export type SegmentData = [number, number, number, number, number, number, number, number, boolean];
export const SEG_PASSED = 6;
export const SEG_TOTAL = 7;

export interface LevelData {
  level: number;
  radicals: SegmentData;
  kanji: SegmentData;
  vocabulary: SegmentData;
}

interface SubjAss { subject: ApiSubject; assignment: StoredAssignment }
export function analyze(
  userLevel: number,
  maxLevel: number,
  assignments: StoredAssignmentMap | undefined,
  subjects: StoredSubjectMap | undefined
): LevelData[] {
  if (!assignments || !subjects) return [];

  // Start by mapping subject IDs to assignments
  const subjectAssignmentMap: Record<number, StoredAssignment> = {};
  for (const assignmentId in assignments) {
    const assignment = assignments[assignmentId];
    if (assignment.data.hidden) continue; // Ignore invalid assignments
    subjectAssignmentMap[assignment.data.subject_id] = assignment;
  }

  // Group the subjects by level, filtering out invalid ones
  const lvlSubjAss: Record<number, SubjAss[]> = {};
  for (const subjectId in subjects) {
    const subject = subjects[subjectId];
    if (subject.data.hidden_at) continue; // Ignore invalid subjects
    // Only get subjects at or below the current level
    if (!subject || subject.data.level > userLevel) continue;

    // If on a free subscription, remove subjects outside of max level
    if (subject.data.level > maxLevel) continue;

    // See if we can find an assignment for this subject
    const assignment = subjectAssignmentMap[subject.id];

    // Add the subject to the level's group
    const sLevel = subject.data.level;
    const subjAss: SubjAss = { subject, assignment };

    if (lvlSubjAss[sLevel]) lvlSubjAss[sLevel].push(subjAss);
    else lvlSubjAss[sLevel] = [subjAss];
  }

  // Now, for each level, get all the SRS stage counts and aggregate the data
  const levelData: LevelData[] = [];
  for (let lvl = 1; lvl <= userLevel; lvl++) {
    const lvlSubjects = lvlSubjAss[lvl];
    if (!lvlSubjects) continue; // WTF?

    // Locked, Lesson, Appr I, Appr II, Appr III, Appr IV, Passed, Total
    const radicals: SegmentData = [0, 0, 0, 0, 0, 0, 0, 0, true];
    const kanji: SegmentData = [0, 0, 0, 0, 0, 0, 0, 0, true];
    const vocabulary: SegmentData = [0, 0, 0, 0, 0, 0, 0, 0, true];

    // For each subject, increment the counters
    for (const { subject, assignment } of lvlSubjects) {
      // Figure out which array to insert data to
      let arr: SegmentData;
      switch (subject.object) {
      case "radical": arr = radicals; break;
      case "kanji": arr = kanji; break;
      case "vocabulary":
      case "kana_vocabulary":
        arr = vocabulary;
        break;
      }

      // Increment the total
      arr[SEG_TOTAL]++;

      if (!assignment?.data.unlocked_at) {
        // If there is no assignment, or an assignment has not yet been
        // unlocked, increment 'Locked'
        arr[0]++;
      } else {
        // If the subject has not been passed, mark this segment as not passed.
        // This means the bar will always appear regardless of settings. Note
        // that checking passed_at is not the same as checking the SRS stage.
        if (!assignment.data.passed_at) {
          arr[8] = false;
        }

        const stage = assignment.data.srs_stage;

        if (stage >= 0 && stage <= 4) {
          // Otherwise, if the SRS stage is between Lesson and Appr IV
          // (inclusive), increment the appropriate stage's counter
          (arr[stage + 1] as number)++;
        } else {
          // Otherwise, increment 'Passed'
          arr[SEG_PASSED]++;
        }
      }
    }

    // Create the LevelData for this level
    const levelDatum: LevelData = {
      level: lvl,
      radicals, kanji, vocabulary
    };
    levelData.push(levelDatum);
  }

  return levelData;
}

export function isComplete(
  segment: SegmentData,
  includePassed: boolean
): boolean {
  return segment[SEG_PASSED] >= segment[SEG_TOTAL]
    || (!includePassed && segment[8]); // Setting to hide if all have passed_at
}
