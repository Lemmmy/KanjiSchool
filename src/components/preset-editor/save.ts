// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { setPresets } from "@store/settingsSlice.ts";

import { Preset, PresetType } from ".";

import { lsSetObject } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:preset-editor-save");

export function savePreset(presetType: PresetType, preset: Preset): void {
  const presets = [...store.getState().settings.presets[presetType]];

  // If the preset already exists in the presets list, then replace it
  let replaced = false;
  for (let i = 0; i < presets.length; i++) {
    const oldPreset = presets[i];
    if (oldPreset.uuid === preset.uuid) {
      debug("saving replacing %s", preset.uuid);
      presets[i] = preset;
      replaced = true;
      break;
    }
  }

  // Otherwise, insert it at the end of the list
  if (!replaced) {
    debug("saving inserting %s", preset.uuid);
    presets.push(preset);
  }

  // Save the new presets to localStorage and update the Redux store
  debug("saving to localStorage");
  lsSetObject(presetType + "Presets", presets);
  debug("dispatching save to redux");
  store.dispatch(setPresets({ presetType, presets }));
}
