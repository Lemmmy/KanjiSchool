// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";
import * as actions from "@actions/SettingsActions";

import { PresetType } from ".";

import { lsSetObject } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:preset-editor-delete");

export function deletePreset(presetType: PresetType, uuid: string): void {
  // Get a new presets list without the one we want to delete
  const presets = store.getState().settings.presets[presetType]
    .filter(p => p.uuid !== uuid);

  // Save the new presets to localStorage and update the Redux store
  debug("saving to localStorage");
  lsSetObject(presetType + "Presets", presets);
  debug("dispatching save to redux");
  store.dispatch(actions.setPresets({ presetType, presets }));
}
