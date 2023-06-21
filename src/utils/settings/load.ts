// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import {
  getSettingKey, SettingsState, DEFAULT_SETTINGS, AnySettingName, SettingName
} from ".";

import Debug from "debug";
const debug = Debug("kanjischool:settings-load");

export function loadSettings(): SettingsState {
  // Import the default settings first
  const settings = { ...DEFAULT_SETTINGS };
  debug("loading settings");

  // Output for debug
  const tbl: any = {};

  // Using the default settings as a template, import the settings from local
  // storage
  for (const [settingName, value] of Object.entries(settings) as [AnySettingName, any][]) {
    const stored = localStorage.getItem(getSettingKey(settingName));
    tbl[settingName] = { default: value, stored };
    // debug("setting %s - stored: %o - default: %o", settingName, stored, value);

    if (stored === null) {
      // debug("setting %s does not have a stored value", settingName);
      continue;
    }

    switch (typeof value) {
    case "boolean":
      settings[settingName as SettingName<boolean>] = stored === "true";
      break;
    case "number":
      settings[settingName as SettingName<number>] = parseInt(stored);
      break;
    case "string":
      (settings as any)[settingName] = stored;
      break;
    }
  }

  // Print all the settings to the console
  console.table(tbl);

  return settings;
}
