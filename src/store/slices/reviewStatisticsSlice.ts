// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiReviewStatistic, ApiReviewStatisticMap, SubjectReviewStatisticIdMap } from "@api";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ReviewStatisticsSliceState {
  readonly reviewStatistics?: ApiReviewStatisticMap;
  readonly subjectReviewStatisticIdMap: SubjectReviewStatisticIdMap;
}

export const initialState = (): ReviewStatisticsSliceState => ({
  reviewStatistics: undefined,
  subjectReviewStatisticIdMap: {},
});

const reviewStatisticsSlice = createSlice({
  name: "reviewStatistics",
  initialState,
  reducers: {
    // Initialise review statistic map from database. Also sets up the subject ID to review statistic ID map.
    initReviewStatistics(s, { payload }: PayloadAction<ApiReviewStatisticMap>) {
      const subjectReviewStatisticIdMap: SubjectReviewStatisticIdMap = {};
      for (const reviewStatisticId in payload) {
        const reviewStatistic = payload[reviewStatisticId];
        subjectReviewStatisticIdMap[reviewStatistic.data.subject_id] = reviewStatistic.id;
      }

      s.reviewStatistics = payload;
      s.subjectReviewStatisticIdMap = subjectReviewStatisticIdMap;
    },

    // Update an individual review statistic. Also updates the subject ID to review statistic ID map.
    updateReviewStatistic(s, { payload }: PayloadAction<ApiReviewStatistic>) {
      const { id, data } = payload;
      s.reviewStatistics![id] = payload;
      s.subjectReviewStatisticIdMap[data.subject_id] = id;
    },
  }
});

export const {
  initReviewStatistics,
  updateReviewStatistic
} = reviewStatisticsSlice.actions;

export default reviewStatisticsSlice.reducer;
