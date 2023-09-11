// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { defaultFonts, loadSettings, lsGetNumber, lsGetObject, SettingsState } from "@utils";
import { Preset, PresetType } from "@comp/preset-editor";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PickByValue } from "utility-types";

export type SettingsSliceState = SettingsState & {
  /** Whether the keyboard shortcuts modal is currently shown. */
  readonly hotkeyHelpVisible: boolean;

  /** Study options presets. */
  readonly presets: Record<PresetType, Preset[]>;

  /** Custom fonts for font randomizer. */
  readonly customFonts: string[];
  readonly supportedFonts: Record<string, boolean>;

  readonly tip: number;
  readonly getReviewsWarning: boolean;
};

export const initialState = (): SettingsSliceState => ({
  ...loadSettings(),
  hotkeyHelpVisible: false,
  presets: {
    lesson: lsGetObject<Preset[]>("lessonPresets") ?? [],
    review: lsGetObject<Preset[]>("reviewPresets") ?? []
  },
  customFonts: lsGetObject<string[]>("customFonts") ?? defaultFonts,
  supportedFonts: lsGetObject<Record<string, boolean>>("supportedFonts") ?? {},
  tip: lsGetNumber("tip") ?? -1,
  getReviewsWarning: lsGetObject<boolean>("getReviewsWarning") ?? false
});

interface SetSettingPayload<T> {
  settingName: keyof PickByValue<SettingsSliceState, T>;
  value: T;
}

type SetSettingPayloadAction<T> = PayloadAction<SetSettingPayload<T>>;

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setBooleanSetting(s, { payload }: SetSettingPayloadAction<boolean>) {
      s[payload.settingName] = payload.value;
    },

    setIntegerSetting(s, { payload }: SetSettingPayloadAction<number>) {
      s[payload.settingName] = payload.value;
    },

    setStringSetting(s, { payload }: SetSettingPayloadAction<string>) {
      // TODO: ???
      (s as any)[payload.settingName] = payload.value;
    },

    setHotkeyHelpVisible(s, { payload }: PayloadAction<boolean>) {
      s.hotkeyHelpVisible = payload;
    },

    setPresets(s, { payload }: PayloadAction<{
      presetType: PresetType;
      presets: Preset[];
    }>) {
      s.presets[payload.presetType] = payload.presets;
    },

    setCustomFonts(s, { payload }: PayloadAction<string[]>) {
      s.customFonts = payload;
    },

    setSupportedFont(s, { payload }: PayloadAction<{
      font: string;
      supported: boolean;
    }>) {
      const { font, supported } = payload;
      s.supportedFonts[font] = supported;
    },

    setSupportedFonts(s, { payload }: PayloadAction<Record<string, boolean>>) {
      s.supportedFonts = payload;
    },

    setTip(s, { payload }: PayloadAction<number>) {
      s.tip = payload;
    },

    setGetReviewsWarning(s, { payload }: PayloadAction<boolean>) {
      s.getReviewsWarning = payload;
    },
  }
});

export const {
  setBooleanSetting,
  setIntegerSetting,
  setStringSetting,
  setHotkeyHelpVisible,
  setPresets,
  setCustomFonts,
  setSupportedFont,
  setSupportedFonts,
  setTip,
  setGetReviewsWarning
} = settingsSlice.actions;

export default settingsSlice.reducer;
