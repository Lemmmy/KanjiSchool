// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";
import * as actions from "@actions/SyncActions";

import * as api from "@api";
import { ApiAssignment } from "@api";

import { isRecentTime } from "@utils/isRecentTime";

export async function startAssignment(
  assignmentId: number,
  startedAt: Date | null
): Promise<ApiAssignment> {
  const url = `/assignments/${encodeURIComponent(assignmentId)}/start`;
  const res = await api.put<ApiAssignment>(url, {
    started_at: isRecentTime(startedAt) ? undefined : startedAt?.toISOString()
  });

  // Update the assignment in the Redux store
  const assignment = api.initAssignment(res);
  store.dispatch(actions.updateAssignment(assignment));

  return res;
}
