// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { TypedUseSelectorHook, useSelector } from "react-redux";
import { configureStore, EnhancedStore } from "@reduxjs/toolkit";

import assignmentsReducer, { AssignmentsSliceState } from "@store/slices/assignmentsSlice.ts";
import authReducer, { AuthSliceState } from "./slices/authSlice.ts";
import imagesReducer, { ImagesSliceState } from "@store/slices/imagesSlice.ts";
import levelProgressionsSlice, { LevelProgressionsSliceState } from "@store/slices/levelProgressionsSlice.ts";
import reviewsReducer, { ReviewsSliceState } from "@store/slices/reviewsSlice.ts";
import reviewStatisticsReducer, { ReviewStatisticsSliceState } from "@store/slices/reviewStatisticsSlice.ts";
import sessionReducer, { SessionSliceState } from "./slices/sessionSlice.ts";
import settingsReducer, { SettingsSliceState } from "./slices/settingsSlice.ts";
import studyMaterialsSlice, { StudyMaterialsSliceState } from "@store/slices/studyMaterialsSlice.ts";
import subjectsReducer, { SubjectsSliceState } from "./slices/subjectsSlice.ts";
import syncReducer, { SyncSliceState } from "./slices/syncSlice.ts";

import { devToolsOptions } from "./devTools.ts";

export interface RootState {
  assignments      : AssignmentsSliceState;
  auth             : AuthSliceState;
  images           : ImagesSliceState;
  levelProgressions: LevelProgressionsSliceState;
  reviews          : ReviewsSliceState;
  reviewStatistics : ReviewStatisticsSliceState;
  session          : SessionSliceState;
  settings         : SettingsSliceState;
  studyMaterials   : StudyMaterialsSliceState;
  subjects         : SubjectsSliceState;
  sync             : SyncSliceState;
}

export let store: EnhancedStore<RootState>;

export function initStore(): void {
  if (store) return;

  store = configureStore({
    reducer: {
      assignments      : assignmentsReducer,
      auth             : authReducer,
      images           : imagesReducer,
      levelProgressions: levelProgressionsSlice,
      reviews          : reviewsReducer,
      reviewStatistics : reviewStatisticsReducer,
      session          : sessionReducer,
      settings         : settingsReducer,
      studyMaterials   : studyMaterialsSlice,
      subjects         : subjectsReducer,
      sync             : syncReducer
    },

    devTools: process.env.NODE_ENV === "development" ? devToolsOptions : false,

    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // SerializableStateInvariantMiddleware took 38ms, which is more than the warning threshold of 32ms
        // https://redux-toolkit.js.org/api/getDefaultMiddleware
        serializableCheck: false,
      }),
  });
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
