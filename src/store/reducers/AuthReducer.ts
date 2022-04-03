// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import * as actions from "@actions/AuthActions";
import { createReducer } from "typesafe-actions";

import { ApiUser } from "@api";

import { lsGetObject, lsGetString } from "@utils";

export interface State {
  readonly apiKey?: string;
  readonly user?: ApiUser;
}

export function getInitialAuthState(): State {
  return {
    apiKey: lsGetString("apiKey"),
    user: lsGetObject<ApiUser>("user")
  };
}

export const AuthReducer = createReducer({ isLoggedIn: false } as State)
  // Set api key
  .handleAction(actions.setApiKey, (state, { payload }) => ({
    ...state, apiKey: payload
  }))
  // Set user
  .handleAction(actions.setUser, (state, { payload }) => ({
    ...state, user: payload
  }));
