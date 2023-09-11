// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { globalMessage } from "@global/AntInterface.tsx";

import { store } from "@store";
import * as settings from "@store/slices/settingsSlice.ts";

import { getSettingKey, SettingName, SETTING_CONFIGS } from ".";

import Debug from "debug";
const debug = Debug("kanjischool:settings-set");

function notifySettingChange(): void {
  globalMessage.success("Setting changed successfully!");
}

export function setBooleanSetting(
  settingName: SettingName<boolean>,
  value: boolean,
  notify = true
): void {
  debug("changing setting [boolean] %s value to %o", settingName, value);

  localStorage.setItem(getSettingKey(settingName), value ? "true" : "false");
  store.dispatch(settings.setBooleanSetting({
    settingName,
    value
  }));

  if (notify) notifySettingChange();
}

export function setIntegerSetting(
  settingName: SettingName<number>,
  value: number,
  notify = true
): void {
  debug("changing setting [integer] %s value to %o", settingName, value);

  localStorage.setItem(getSettingKey(settingName), Math.floor(value).toString());
  store.dispatch(settings.setIntegerSetting({
    settingName,
    value
  }));

  if (notify) notifySettingChange();
}

export function setStringSetting<T extends string>(
  settingName: SettingName<T>,
  value: T,
  notify = true
): void {
  debug("changing setting [string] %s value to %o", settingName, value);

  localStorage.setItem(getSettingKey(settingName), value);
  store.dispatch(settings.setStringSetting({
    settingName: settingName as any,
    value
  }));

  if (notify) notifySettingChange();
}

export function validateIntegerSetting(settingName: SettingName<number>, value: number): boolean {
  const config = SETTING_CONFIGS[settingName];
  if (!config) return true;

  if (config.min !== undefined && value < config.min) return false;
  if (config.max !== undefined && value > config.max) return false;

  return true;
}
