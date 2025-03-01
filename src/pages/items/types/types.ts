// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { NormalizedSubjectType } from "@api";

export type ItemsBaseType = "wk" | "jlpt" | "joyo" | "freq";
export type ItemsGroupBy = "level" | "jlpt" | "joyo" | "freq" | "type" | "srs" | "none";
export type ItemsSortBy = Exclude<ItemsGroupBy, "none"> | "slug";
export type ItemsColorBy = "type" | "srs";
export type Order = "asc" | "desc";

export interface FormValues {
  frequencyGroupSize?: number;

  groupByPrimary: ItemsGroupBy;
  groupByPrimaryOrder: Order;
  groupBySecondary: ItemsGroupBy;
  groupBySecondaryOrder: Order;

  sortBy: ItemsSortBy;
  sortByOrder: Order;

  colorBy: ItemsColorBy;

  types: NormalizedSubjectType[];
  // 10 is locked
  srsStages: string[]; // TODO: SRS stage numbers, convert back to number later
}
