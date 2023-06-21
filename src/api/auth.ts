// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";
import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";
import * as actions from "@actions/AuthActions";

import * as api from "@api";
import { ApiUser } from "@api";

import { db } from "@db";

import { lsSetBoolean, lsSetObject, lsSetString } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:api-auth");

export const useIsLoggedIn = (): boolean =>
  !!useSelector((s: RootState) => s.auth.user?.data.id);
export const useUser = (): ApiUser | undefined =>
  useSelector((s: RootState) => s.auth.user, shallowEqual);
export const useUsername = (): string | undefined =>
  useSelector((s: RootState) => s.auth.user?.data.username);
export const useUserLevel = (): number =>
  useSelector((s: RootState) => s.auth.user?.data.level) || 1;
export const useUserMaxLevel = (): number =>
  useSelector((s: RootState) => s.auth.user?.data.subscription.max_level_granted) || 3;

/** Attempt to authenticate with the API using the specified API key. If it is
 * successful, save the API key. */
export async function attemptLogIn(apiKey: string): Promise<void> {
  debug("attempting first-time login");

  const user = await api.get<ApiUser>("/user", { apiKey });
  if (!user || !user?.data.id) throw new Error("Invalid login");

  debug("got user %s (lvl %d)", user.data.username, user.data.level);

  lsSetString("apiKey", apiKey);
  lsSetObject("user", user);
  store.dispatch(actions.setApiKey(apiKey));
  store.dispatch(actions.setUser(user));
}

/** Clears all user data and logs out. */
export async function logOut(): Promise<void> {
  debug("logging out");

  // Set a 'clearing data' flag first. If the page disappears/reloads before
  // logging out is complete, we will try again on next load.
  lsSetBoolean("clearingData", true);

  // Delete the user data from local storage
  debug("deleting user data");
  lsSetString("apiKey", null);
  lsSetObject("user", null);

  // Clear the user-relevant stores from the database
  debug("clearing user-relevant db stores");
  await Promise.all([
    db.assignments.clear(),
    db.reviewStatistics.clear(),
    db.reviews.clear(),
    db.levelProgressions.clear(),
    db.studyMaterials.clear(),
    db.queue.clear()
  ]);

  // Clear sync information from local storage
  debug("deleting sync data");
  lsSetString("assignmentsLastSynced", null);
  lsSetString("syncAssignmentsLastVersion", null);
  lsSetString("syncAssignmentsLastTotal", null);
  lsSetString("reviewStatisticsLastSynced", null);
  lsSetString("reviewsLastSynced", null);
  lsSetString("syncReviewsLastVersion", null);
  lsSetString("currentStreak", null);
  lsSetString("maxStreak", null);
  lsSetString("levelProgressionsLastSynced", null);
  lsSetString("syncLevelProgressionsLastVersion", null);
  lsSetString("studyMaterialsLastSynced", null);
  lsSetString("syncStudyMaterialsLastVersion", null);
  lsSetString("pendingLessons2", null);
  lsSetString("pendingReviews2", null);
  lsSetString("nextReviewsCheckTime", null);
  lsSetString("nextReviewsAt", null);
  lsSetString("nextReviewsNow", null);
  lsSetString("nextReviewsCount", null);
  lsSetString("nextReviewsWeek", null);
  lsSetString("tip", null);

  // Clear session information from local storage
  debug("deleting session data");
  lsSetString("sessionOngoing2", null);
  lsSetString("sessionDoingLessons", null);
  lsSetString("sessionLessonCounter", null);
  lsSetString("sessionLastResults", null);
  lsSetString("sessionLastResultsViewed", null);
  lsSetString("selfStudyQueue", null);

  // Unset the 'clearing data' flag finally
  debug("done logging out, removing clearingData flag");
  lsSetBoolean("clearingData", false);
}
