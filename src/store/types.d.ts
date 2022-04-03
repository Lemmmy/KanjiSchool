// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Store, RootAction, RootState } from "./";

declare module "typesafe-actions" {
  interface Types {
    Store: Store;
    RootAction: RootAction;
    RootState: RootState;
  }
}
