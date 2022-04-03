// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RootState } from "@store";
import { useSelector } from "react-redux";

import { SettingName } from ".";

/** React hook that gets the value of a boolean setting. */
export const useBooleanSetting = (setting: SettingName<boolean>): boolean =>
  useSelector((s: RootState) => s.settings[setting]);

/** React hook that gets the value of an integer setting. */
export const useIntegerSetting = (setting: SettingName<number>): number =>
  useSelector((s: RootState) => s.settings[setting]);

export const useStringSetting = <T extends string>(setting: SettingName<T>): T =>
  useSelector((s: RootState) => s.settings[setting] as unknown as T);
