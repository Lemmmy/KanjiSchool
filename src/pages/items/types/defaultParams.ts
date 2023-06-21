// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FormValues, ItemsBaseType } from ".";

export const ALL_WK_STAGES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
export const ALL_STAGES = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];

export const DEFAULT_PARAMS: Record<ItemsBaseType, FormValues> = {
  "wk": {
    groupByPrimary: "level",
    groupByPrimaryOrder: "asc",
    groupBySecondary: "type",
    groupBySecondaryOrder: "asc",
    sortBy: "slug",
    sortByOrder: "asc",
    colorBy: "srs",
    types: ["radical", "kanji", "vocabulary"],
    srsStages: ALL_WK_STAGES
  },
  "jlpt": {
    groupByPrimary: "jlpt",
    groupByPrimaryOrder: "asc",
    groupBySecondary: "none",
    groupBySecondaryOrder: "asc",
    sortBy: "srs",
    sortByOrder: "asc",
    colorBy: "type",
    types: ["kanji"],
    srsStages: ALL_STAGES
  },
  "joyo": {
    groupByPrimary: "joyo",
    groupByPrimaryOrder: "asc",
    groupBySecondary: "none",
    groupBySecondaryOrder: "asc",
    sortBy: "srs",
    sortByOrder: "asc",
    colorBy: "type",
    types: ["kanji"],
    srsStages: ALL_STAGES
  },
  "freq": {
    frequencyGroupSize: 500,
    groupByPrimary: "freq",
    groupByPrimaryOrder: "asc",
    groupBySecondary: "none",
    groupBySecondaryOrder: "asc",
    sortBy: "freq",
    sortByOrder: "asc",
    colorBy: "type",
    types: ["kanji"],
    srsStages: ALL_STAGES
  }
};
