// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiUser } from "@api";

import { lsGetObject, lsGetString } from "@utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthSliceState {
  readonly apiKey?: string;
  readonly user?: ApiUser;
}

export const initialState = (): AuthSliceState => ({
  apiKey: lsGetString("apiKey"),
  user: lsGetObject<ApiUser>("user")
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setApiKey(s, action: PayloadAction<string>) {
      s.apiKey = action.payload;
    },
    setUser(s, action: PayloadAction<ApiUser>) {
      s.user = action.payload;
    }
  }
});

export const { setApiKey, setUser } = authSlice.actions;

export default authSlice.reducer;
