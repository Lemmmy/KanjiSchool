// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";

import * as api from "@api";
import { ApiUser } from "@api";

import * as actions from "@actions/AuthActions";

import { lsSetObject } from "@utils";

export async function syncUser(): Promise<ApiUser> {
  const user = await api.get<ApiUser>("/user");

  store.dispatch(actions.setUser(user));
  lsSetObject("user", user);

  return user;
}
