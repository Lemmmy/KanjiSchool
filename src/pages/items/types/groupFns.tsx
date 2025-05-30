// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectWithAssignment } from "@api";

import {
  nts, JLPT_LEVEL_NAMES, JOYO_GRADE_NAMES, stringifySrsStage,
  normalizedSubjectTypeToNumber, numberToNormalizedSubjectType, uppercaseFirst
} from "@utils";
import { JlptLevels, JoyoGrades } from "@data";

import { ItemsGroupBy } from ".";

export type GroupByFn = (
  item: SubjectWithAssignment,
  freqGroupSize: number
) => number;

export const GROUP_BY_FNS: Record<ItemsGroupBy, GroupByFn> = {
  "level": ([s]) => s.data.level,
  "jlpt" : ([s]) => 5 - (s.data.jisho?.jlpt ?? 0), // Reverse order (N5 first)
  "joyo" : ([s]) => s.data.jisho?.joyo ?? 0,
  "freq" : ([s], groupSize) => Math.floor((s.data.jisho?.nfr ?? 1) / groupSize),
  "type" : ([s]) => normalizedSubjectTypeToNumber(s.object),
  "srs"  : ([,a]) => a?.data.srs_stage ?? 10,
  "none" : () => 0,
};

export type GroupToNodeFn = (
  n: number,
  freqGroupSize: number
) => string;

export const GROUP_BY_TO_NODE_FNS: Record<ItemsGroupBy, GroupToNodeFn> = {
  "level": n => `Level ${n}`,
                // Undo the reverse order:
  "jlpt" : n => JLPT_LEVEL_NAMES[(5 - n) as JlptLevels],
  "joyo" : n => JOYO_GRADE_NAMES[n as JoyoGrades],
  "freq" : (n, g) => `${nts((n * g) + 1)}-${nts((n * g) + g)}`,
  "type" : n => uppercaseFirst(numberToNormalizedSubjectType(n)),
  "srs"  : n => stringifySrsStage(n),
  "none" : () => "All items",
};
