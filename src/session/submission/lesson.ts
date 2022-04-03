// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { notification } from "antd";

import { insertQueueItem, StoredAssignment } from "@api";
import { SessionState } from "../";
import { fakeSubmission } from "./fakeSubmission";

import Debug from "debug";
const debug = Debug("kanjischool:session-submission");

export async function submitAssignmentLesson(
  itemId: number,
  assignment: StoredAssignment,
  sessionState: SessionState
): Promise<void> {
  try {
    const createdAt = new Date();

    // Preemptively mark the assignment as started in the assignment store in
    // Redux and the database (at least until it fails to submit for 3 times).
    await fakeSubmission(assignment, 1, 1, createdAt);

    // Queue the assignment for submission.
    await insertQueueItem("lesson", assignment.id, sessionState.uuid, itemId, createdAt);
    debug("assignment %d added to queue", assignment.id);
  } catch (err) {
    console.error(err);
    notification.error({ message: "Starting assignment failed. See console for details." });
  }
}
