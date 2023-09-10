// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { AnySettingName, SettingName } from ".";

export const getSettingKey = (settingName: AnySettingName): string =>
  "kanjiSchoolSettings." + settingName;

export const getBooleanSetting = (setting: SettingName<boolean>): boolean =>
  store.getState().settings[setting];

export const getIntegerSetting = (setting: SettingName<number>): number =>
  store.getState().settings[setting];

export const getStringSetting = <T extends string>(setting: SettingName<T>): T =>
  store.getState().settings[setting] as unknown as T;
