// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ActionType, StateType } from "typesafe-actions";

export type Store = StateType<typeof import("@app").store>;
export type RootAction = ActionType<typeof import("./actions/index").default>;
export type RootState = StateType<typeof import("./reducers/RootReducer").default>;
