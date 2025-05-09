// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import { getDefaultPresets, Preset, PresetType } from ".";

export const usePresets = (type: PresetType): Preset[] =>
  useAppSelector(s => s.settings.presets[type] ?? [], shallowEqual);

export function usePreset(type: PresetType, uuid?: string): Preset | undefined {
  const userPresets = usePresets(type);

  // Ignore preset editor tree root nodes
  if (!uuid || uuid.startsWith("root-")) return;

  const defaultPresets = getDefaultPresets(type);
  const search = uuid.startsWith("default-") ? defaultPresets : userPresets;
  return search.find(p => p.uuid === uuid);
}
