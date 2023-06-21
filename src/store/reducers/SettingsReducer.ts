// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { createReducer } from "typesafe-actions";
import { loadSettings, SettingsState } from "@utils/settings";
import {
  setBooleanSetting, setIntegerSetting, setStringSetting, setHotkeyHelpVisible,
  setPresets, setTip, setCustomFonts, setSupportedFont, setSupportedFonts
} from "@actions/SettingsActions";

import { Preset, PresetType } from "@comp/preset-editor";

import { defaultFonts, lsGetNumber, lsGetObject } from "@utils";

export type State = SettingsState & {
  /** Whether or not the keyboard shortcuts modal is currently shown. */
  readonly hotkeyHelpVisible: boolean;

  /** Study options presets. */
  readonly presets: Record<PresetType, Preset[]>;

  /** Custom fonts for font randomizer. */
  readonly customFonts: string[];
  readonly supportedFonts: Record<string, boolean>;

  readonly tip: number;
};

export function getInitialSettingsState(): State {
  return {
    ...loadSettings(),
    hotkeyHelpVisible: false,
    presets: {
      lesson: lsGetObject<Preset[]>("lessonPresets") ?? [],
      review: lsGetObject<Preset[]>("reviewPresets") ?? []
    },
    customFonts: lsGetObject<string[]>("customFonts") ?? defaultFonts,
    supportedFonts: lsGetObject<Record<string, boolean>>("supportedFonts") ?? {},
    tip: lsGetNumber("tip") ?? -1
  };
}

export const SettingsReducer = createReducer({} as State)
  .handleAction(setBooleanSetting, (state, { payload }): State => ({
    ...state,
    [payload.settingName]: payload.value
  }))
  .handleAction(setIntegerSetting, (state, { payload }): State => ({
    ...state,
    [payload.settingName]: payload.value
  }))
  .handleAction(setStringSetting, (state, { payload }): State => ({
    ...state,
    [payload.settingName]: payload.value
  }))
  .handleAction(setHotkeyHelpVisible, (state, { payload }): State => ({ ...state, hotkeyHelpVisible: payload }))
  .handleAction(setPresets, (state, { payload }): State => ({
    ...state,
    presets: {
      ...state.presets,
      [payload.presetType]: payload.presets
    }
  }))
  .handleAction(setCustomFonts, (state, { payload }): State =>
    ({ ...state, customFonts: payload }))
  .handleAction(setSupportedFont, (state, { payload }): State => {
    const supportedFonts = { ...state.supportedFonts };
    const { font, supported } = payload;
    supportedFonts[font] = supported;
    return { ...state, supportedFonts };
  })
  .handleAction(setSupportedFonts, (state, { payload }): State =>
    ({ ...state, supportedFonts: payload }))
  .handleAction(setTip, (state, { payload }): State =>
    ({ ...state, tip: payload }));
