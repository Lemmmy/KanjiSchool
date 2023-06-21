// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SettingsState, SettingsStateBase } from ".";

import { PickByValue } from "utility-types";

export type AnySettingName = keyof SettingsStateBase;
export type SettingName<T> = keyof PickByValue<SettingsState, T>;

export interface IntegerSettingConfig {
  min?: number;
  max?: number;
}
