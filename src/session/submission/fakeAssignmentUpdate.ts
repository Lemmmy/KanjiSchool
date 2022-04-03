// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";
import * as syncActions from "@actions/SyncActions";

import { StoredSubject, StoredAssignment } from "@api";
import { db } from "@db";

import { startOfHour, add as dateAdd } from "date-fns";
import { getSrsSystemStageDurationSeconds } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:session-submission");

export async function fakeAssignmentUpdate(
  subject: StoredSubject,
  assignment: StoredAssignment,
  newSrsStage: number,
  createdAt: Date
): Promise<void> {
  // If we passed to SRS 9, mark this assignment as burned.
  const burnedAt = assignment.data.burned_at ||
    (newSrsStage >= 9 ? createdAt.toISOString() : null);
  // If we passed to SRS 5 for the first time, mark this assignment as passed.
  const passedAt = assignment.data.passed_at ||
    (newSrsStage >= 5 ? createdAt.toISOString() : null);
  // If this is a lesson submission, mark this assignment as started.
  const startedAt = assignment.data.started_at || createdAt.toISOString();

  // Calculate the availableAt date based on the SRS system. Set it to null if
  // this assignment is now burned.
  const systemId = subject.data.spaced_repetition_system_id;
  const availableAt = calculateNextSrsStage(systemId, newSrsStage, createdAt);

  // Create the new assignment with the updated values
  const newAssignment: StoredAssignment = {
    ...assignment,
    data_updated_at: createdAt.toISOString(),
    data: {
      ...assignment.data,
      srs_stage: newSrsStage,
      burned_at: burnedAt,
      passed_at: passedAt,
      started_at: startedAt,
      available_at: availableAt?.toISOString() ?? null
    }
  };
  debug("storing fake assignment %d: %o", newAssignment.id, newAssignment);

  // Store it everywhere
  db.assignments.put(newAssignment);
  store.dispatch(syncActions.updateAssignment(newAssignment));
}

function calculateNextSrsStage(
  systemId: number,
  newSrsStage: number,
  createdAt: Date
): Date | null {
  // Calculate the availableAt date based on the SRS system. Set it to null if
  // this assignment is now burned.
  const duration = getSrsSystemStageDurationSeconds(systemId, newSrsStage);
  if (duration <= 0) return null; //  0 usually means "burned".

  // Add the SRS interval to the createdAt time
  const afterDuration = dateAdd(createdAt, { "seconds": duration });

  // Get the start of the hour
  return startOfHour(afterDuration);
}
