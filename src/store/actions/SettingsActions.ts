// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { PickByValue } from "utility-types";
import { createAction } from "typesafe-actions";

import * as constants from "../constants";

import { State } from "@reducers/SettingsReducer";
import { PresetType, Preset } from "@comp/preset-editor";

// Boolean settings
export interface SetBooleanSettingPayload {
  settingName: keyof PickByValue<State, boolean>;
  value: boolean;
}
export const setBooleanSetting = createAction(constants.SET_BOOLEAN_SETTING)<SetBooleanSettingPayload>();

// Integer settings
export interface SetIntegerSettingPayload {
  settingName: keyof PickByValue<State, number>;
  value: number;
}
export const setIntegerSetting = createAction(constants.SET_INTEGER_SETTING)<SetIntegerSettingPayload>();

// String settings
export interface SetStringSettingPayload {
  settingName: keyof PickByValue<State, string>;
  value: string;
}
export const setStringSetting = createAction(constants.SET_STRING_SETTING)<SetStringSettingPayload>();

export const setHotkeyHelpVisible = createAction(constants.SET_HOTKEY_HELP_VISIBLE)<boolean>();

export interface SetPresetsPayload {
  presetType: PresetType;
  presets: Preset[];
}
export const setPresets = createAction(constants.SET_PRESETS)<SetPresetsPayload>();

export const setTip = createAction(constants.SET_TIP)<number>();
