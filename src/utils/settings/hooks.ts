// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAppSelector } from "@store";

import { SettingName } from ".";

/** React hook that gets the value of a boolean setting. */
export const useBooleanSetting = (setting: SettingName<boolean>): boolean =>
  useAppSelector(s => s.settings[setting]);

/** React hook that gets the value of an integer setting. */
export const useIntegerSetting = (setting: SettingName<number>): number =>
  useAppSelector(s => s.settings[setting]);

export const useStringSetting = <T extends string>(setting: SettingName<T>): T =>
  useAppSelector(s => s.settings[setting] as unknown as T);
