// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectWithAssignment } from "@api";

import { asc, desc, map, Comparator, byLevel, bySrs, byType } from "@utils/comparator";

import { ItemsSortBy } from ".";

export type SortByFn = Comparator<SubjectWithAssignment>;

export const SORT_BY_FNS: Record<ItemsSortBy, SortByFn> = {
  "level": byLevel(),
  "jlpt" : map(([s]) => s.data.jisho?.jlpt ?? 0, desc), // Desc (N5 first)
  "joyo" : map(([s]) => s.data.jisho?.joyo ?? 0, asc),
  "freq" : map(([s]) => s.data.jisho?.nfr ?? 2500, asc),
  "type" : byType(),
  "srs"  : bySrs(),
  "slug" : map(([s]) => s.data.slug, asc)
};
