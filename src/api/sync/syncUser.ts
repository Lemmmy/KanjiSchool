// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { setUser } from "@store/authSlice.ts";

import * as api from "@api";
import { ApiUser } from "@api";

import { lsSetObject } from "@utils";

export async function syncUser(): Promise<ApiUser> {
  const user = await api.get<ApiUser>("/user");

  store.dispatch(setUser(user));
  lsSetObject("user", user);

  return user;
}
