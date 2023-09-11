// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { StreakData } from "@pages/dashboard/summary/calculateStreak.ts";
import { AssignmentSubjectId, NextReviewsAvailable, ReviewForecast } from "@api";
import { lsGetBoolean, lsGetNumber, lsGetObject, lsGetString } from "@utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ReviewsSliceState {
  readonly streak: StreakData;
  readonly pendingLessons: AssignmentSubjectId[];
  readonly pendingReviews: AssignmentSubjectId[];
  readonly nextReviewsAvailable: NextReviewsAvailable;
  readonly reviewForecast?: ReviewForecast;
}

export const initialState = (): ReviewsSliceState => ({
  streak: {
    currentStreak: lsGetNumber("currentStreak") ?? 0,
    maxStreak: lsGetNumber("maxStreak") ?? 0,
    todayInStreak: false // always manually calculate
  },
  pendingLessons: lsGetObject<AssignmentSubjectId[]>("pendingLessons2") || [],
  pendingReviews: lsGetObject<AssignmentSubjectId[]>("pendingReviews2") || [],
  nextReviewsAvailable: {
    checkTime: lsGetString("nextReviewsCheckTime") || null,
    nextReviewsAt: lsGetString("nextReviewsAt") || null,
    nextReviewsNow: lsGetBoolean("nextReviewsNow"),
    nextReviewsCount: lsGetNumber("nextReviewsCount", 0) || 0,
    nextReviewsWeek: lsGetNumber("nextReviewsWeek", 0) || 0,
  },
});

const reviewsSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
    setStreak(s, { payload }: PayloadAction<StreakData>) {
      s.streak = payload;
    },
    setPendingLessons(s, { payload }: PayloadAction<AssignmentSubjectId[]>) {
      s.pendingLessons = payload;
    },
    setPendingReviews(s, { payload }: PayloadAction<AssignmentSubjectId[]>) {
      s.pendingReviews = payload;
    },
    setNextReviewsAvailable(s, { payload }: PayloadAction<NextReviewsAvailable>) {
      s.nextReviewsAvailable = payload;
    },
    setReviewForecast(s, { payload }: PayloadAction<ReviewForecast>) {
      s.reviewForecast = payload;
    },
  }
});

export const {
  setStreak,
  setPendingLessons,
  setPendingReviews,
  setNextReviewsAvailable,
  setReviewForecast
} = reviewsSlice.actions;

export default reviewsSlice.reducer;
