// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Preset, PresetType } from ".";

import memoizee from "memoizee";

export const DEFAULT_PRESETS: Omit<Preset, "uuid">[] = [
  {
    name: "All shuffle",
    types: ["lesson", "review"],
    opts: {
      order: "SHUFFLE",
      orderReversed: false,
      orderPriority: "LEVEL_UP_FIRST",
      all: true,
      overdueFirst: false
    }
  },
  {
    name: "Level-up first, all shuffle",
    types: ["lesson", "review"],
    opts: {
      order: "SHUFFLE",
      orderReversed: false,
      orderPriority: "LEVEL_UP_FIRST",
      all: true,
      overdueFirst: false
    }
  },
  {
    name: "Level-up items first",
    types: ["lesson", "review"],
    opts: {
      order: "SHUFFLE",
      orderReversed: false,
      orderPriority: "LEVEL_UP_FIRST",
      overdueFirst: false
    }
  },
  {
    name: "Current-level radicals and kanji first",
    nameNode: <>Current-level <span className="color-radical">radicals</span> and <span className="color-kanji">kanji</span> first</>,
    types: ["lesson", "review"],
    opts: {
      order: "SHUFFLE",
      orderReversed: false,
      orderPriority: "CURRENT_LEVEL_RADICAL_KANJI_FIRST",
      overdueFirst: false
    }
  },
  {
    name: "Radicals, then kanji, then vocabulary",
    nameNode: <><span className="color-radical">Radicals</span>, then <span className="color-kanji">kanji</span>, then <span className="color-vocabulary">vocabulary</span></>,
    types: ["lesson", "review"],
    opts: {
      order: "TYPE",
      orderReversed: false,
      overdueFirst: false
    }
  },
  {
    name: "Radicals first",
    nameNode: <><span className="color-radical">Radicals</span> first</>,
    types: ["lesson", "review"],
    opts: {
      order: "SHUFFLE",
      orderReversed: false,
      orderPriority: "RADICALS_FIRST",
      overdueFirst: false
    }
  },
  {
    name: "Kanji first",
    nameNode: <><span className="color-kanji">Kanji</span> first</>,
    types: ["lesson", "review"],
    opts: {
      order: "SHUFFLE",
      orderReversed: false,
      orderPriority: "KANJI_FIRST",
      overdueFirst: false
    }
  },
  {
    name: "Vocabulary first",
    nameNode: <><span className="color-vocabulary">Vocabulary</span> first</>,
    types: ["lesson", "review"],
    opts: {
      order: "SHUFFLE",
      orderReversed: false,
      orderPriority: "VOCABULARY_FIRST",
      overdueFirst: false
    }
  },
  {
    name: "SRS stage ascending",
    types: ["review"],
    opts: {
      order: "SRS",
      orderReversed: false,
      orderPriority: "NONE",
      overdueFirst: false
    }
  },
  {
    name: "SRS stage descending",
    types: ["review"],
    opts: {
      order: "SRS",
      orderReversed: true,
      orderPriority: "NONE",
      overdueFirst: false
    }
  },
  {
    name: "B2B pairs",
    types: ["review"],
    opts: {
      order: "SRS",
      orderReversed: true,
      orderPriority: "NONE",
      overdueFirst: false,
      meaningReadingBackToBack: true,
      meaningFirst: true
    }
  },
];

function _getDefaultPresets(type: PresetType): Preset[] {
  // Only grab the default presets for the desired type
  return DEFAULT_PRESETS.filter(p => p.types.includes(type))
    // Add a UUID to the presets like "default-i"
    .map((p, i) => ({ ...p, uuid: "default-" + i }));
}
export const getDefaultPresets = memoizee(_getDefaultPresets);
