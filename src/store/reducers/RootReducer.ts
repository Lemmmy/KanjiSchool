// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { combineReducers } from "redux";

import { AuthReducer } from "./AuthReducer";
import { SyncReducer } from "./SyncReducer";
import { SessionReducer } from "./SessionReducer";
import { SettingsReducer } from "./SettingsReducer";

export default combineReducers({
  auth: AuthReducer,
  sync: SyncReducer,
  session: SessionReducer,
  settings: SettingsReducer,
});
