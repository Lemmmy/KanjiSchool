// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { TypedUseSelectorHook, useSelector } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import authReducer, { AuthSliceState } from "./authSlice.ts";
import sessionReducer, { SessionSliceState } from "./sessionSlice.ts";
import settingsReducer, { SettingsSliceState } from "./settingsSlice.ts";
import syncReducer, { SyncSliceState } from "./syncSlice.ts";

import { devToolsOptions } from "./devTools.ts";
import { ToolkitStore } from "@reduxjs/toolkit/dist/configureStore";

export interface RootState {
  auth: AuthSliceState;
  session: SessionSliceState;
  settings: SettingsSliceState;
  sync: SyncSliceState;
}

export let store: ToolkitStore<RootState>;

export function initStore(): void {
  if (store) return;

  store = configureStore({
    reducer: {
      auth: authReducer,
      session: sessionReducer,
      settings: settingsReducer,
      sync: syncReducer
    },
    devTools: devToolsOptions,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        // SerializableStateInvariantMiddleware took 38ms, which is more than the warning threshold of 32ms
        // https://redux-toolkit.js.org/api/getDefaultMiddleware
        serializableCheck: false,
      }),
  });
}

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
