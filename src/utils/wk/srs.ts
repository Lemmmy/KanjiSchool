// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiSrsStage, SubjectWithAssignment } from "@api";
import { getIntegerSetting } from "@utils";

import { srsSystems } from "@data";

import dayjs, { UnitType } from "dayjs";

import memoize from "memoizee";

export function stringifySrsStage(stage: number): string {
  switch (stage) {
  case 0:  return "Lesson";
  case 1:  return "Apprentice I";
  case 2:  return "Apprentice II";
  case 3:  return "Apprentice III";
  case 4:  return "Apprentice IV";
  case 5:  return "Guru I";
  case 6:  return "Guru II";
  case 7:  return "Master";
  case 8:  return "Enlightened";
  case 9:  return "Burned";
  default: return "Locked";
  }
}

export function stringifySrsStageShort(stage: number): string {
  switch (stage) {
  case 0:  return "Lesson";
  case 1:  return "Appr I";
  case 2:  return "Appr II";
  case 3:  return "Appr III";
  case 4:  return "Appr IV";
  case 5:  return "Guru I";
  case 6:  return "Guru II";
  case 7:  return "Master";
  case 8:  return "Enl";
  case 9:  return "Burned";
  default: return "Locked";
  }
}

export type SrsStageBaseName = "Lesson" | "Apprentice" | "Guru" | "Master" |
  "Enlightened" | "Burned" | "Locked";
export function getSrsStageBaseName(stage: number): SrsStageBaseName {
  switch (stage) {
  case 0:  return "Lesson";
  case 1: case 2: case 3: case 4: return "Apprentice";
  case 5: case 6: return "Guru";
  case 7:  return "Master";
  case 8:  return "Enlightened";
  case 9:  return "Burned";
  default: return "Locked";
  }
}

export function getSrsReviewBucketName(stage: number): "apprentice" | "guru" | "master" | "enlightened" {
  switch (stage) {
  case 1: case 2: case 3: case 4: return "apprentice";
  case 5: case 6: return "guru";
  case 7: return "master";
  case 8: return "enlightened";
  default: return "apprentice";
  }
}

function getSrsPenaltyFactor(currentSrsStage: number): number {
  return currentSrsStage >= 5 ? 2 : 1;
}

export function getNewSrsStage(
  currentSrsStage: number,
  incorrectAnswers: number
): number {
  // If there were no incorrect answers, increment the SRS stage
  if (incorrectAnswers <= 0) return Math.min(currentSrsStage + 1, 9);

  // Otherwise, follow the decrement formula as per
  // https://knowledge.wanikani.com/wanikani/srs-stages/
  const penaltyFactor = getSrsPenaltyFactor(currentSrsStage);
  const incorrectAdjustmentCount = Math.ceil(incorrectAnswers / 2);
  const newSrsStage = currentSrsStage - (incorrectAdjustmentCount * penaltyFactor);
  return Math.max(newSrsStage, 1);
}

export function getOverdueThreshold(): number {
  const setting = getIntegerSetting("overdueThreshold");
  if (setting < 1 || setting > 100) return 0.2;
  return setting / 100;
}

export function getSrsSystemStage(srsId: number, stage: number): ApiSrsStage {
  const stageSystem = srsSystems[srsId];
  return stageSystem.data.stages[stage];
}

function _getSrsSystemStageDurationSeconds(srsId: number, stage: number): number {
  const system = getSrsSystemStage(srsId, stage);
  const { interval, interval_unit: intervalUnit } = system;
  if (!intervalUnit || interval === null) return 0;

  // Convert the interval to seconds
  switch (intervalUnit) {
  case "milliseconds": return interval / 1000;
  case "seconds":      return interval;
  case "minutes":      return interval * 60;
  case "hours":        return interval * 60 * 60;
  case "days":         return interval * 60 * 60 * 24;
  case "weeks":        return interval * 60 * 60 * 24 * 7;
  }
}
export const getSrsSystemStageDurationSeconds = memoize(_getSrsSystemStageDurationSeconds);

function _stringifySrsStageDuration(srsId: number, stage: number): string {
  const durationSecs = getSrsSystemStageDurationSeconds(srsId, stage);
  return dayjs.duration(durationSecs, "seconds").humanize();
}
export const stringifySrsStageDuration = memoize(_stringifySrsStageDuration);

/**
 * Returns whether a subject is overdue: has at least [threshold] percent
 * of the SRS interval elapsed since the latest review became available?
 */
export function isOverdue([subject, assignment]: SubjectWithAssignment): boolean {
  if (!assignment) return false;

  // Ignore invalid assignments
  if (assignment.data.hidden || subject.data.hidden_at ||
    !assignment.data.available_at || !assignment.data.unlocked_at)
    return false;

  const stage = assignment.data.srs_stage;

  // Initial items are always overdue
  if (stage <= 0) return true;
  // Burned items are never overdue
  if (stage >= 9) return false;

  // Get the SRS stage to get the interval and interval unit used
  const system = getSrsSystemStage(subject.data.spaced_repetition_system_id, stage);
  const { interval, interval_unit: intervalUnit } = system;
  if (!interval) return false;

  // Get the time since the subject was available. Discard it if it's not yet
  // available.
  const since = dayjs().diff(assignment.data.available_at, intervalUnit as UnitType);
  if (since <= 0) return false;

  return (since / interval) >= getOverdueThreshold();
}
