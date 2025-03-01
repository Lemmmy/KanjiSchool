// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Preset, PresetType } from ".";

import { v4 as uuidv4 } from "uuid";

export function newPreset(type: PresetType): Preset {
  return {
    uuid: uuidv4(),
    name: "New preset",
    types: [type],
    opts: {
      order: "SHUFFLE",
      orderReversed: false,
      orderPriority: "NONE",
      overdueFirst: false
    }
  };
}
