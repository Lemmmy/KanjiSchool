// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { setPresets } from "@store/slices/settingsSlice.ts";

import { PresetType } from ".";

import { lsSetObject } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:preset-editor-save");

export function movePreset(
  presetType: PresetType,
  uuid: string,
  newPosition: number
): void {
  // Copy the presets list to work with
  const presets = [...store.getState().settings.presets[presetType]];

  // Move the element in the array
  const oldIndex = presets.findIndex(p => p.uuid === uuid);
  if (oldIndex === -1) return;
  presets.splice(newPosition, 0, presets.splice(oldIndex, 1)[0]);

  // Save the new presets to localStorage and update the Redux store
  debug("saving to localStorage");
  lsSetObject(presetType + "Presets", presets);
  debug("dispatching save to redux");
  store.dispatch(setPresets({ presetType, presets }));
}
