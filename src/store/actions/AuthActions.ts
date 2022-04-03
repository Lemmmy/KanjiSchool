// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { createAction } from "typesafe-actions";

import * as constants from "../constants";

import { ApiUser } from "@api";

export const setApiKey = createAction(constants.SET_API_KEY)<string>();
export const setUser = createAction(constants.SET_USER)<ApiUser>();
export const loginFailed = createAction(constants.LOGIN_FAILED)();
