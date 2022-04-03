// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";

import { SubjectWithAssignment } from "@api";

import { startCase } from "lodash-es";
import {
  nts, JLPT_LEVEL_NAMES, JOYO_GRADE_NAMES, stringifySrsStage,
  subjectTypeToNumber, numberToSubjectType
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
  "type" : ([s]) => subjectTypeToNumber(s.object),
  "srs"  : ([,a]) => a?.data.srs_stage ?? 10,
  "none" : () => 0,
};

export type GroupToNodeFn = (
  n: number,
  freqGroupSize: number
) => ReactNode;

export const GROUP_BY_TO_NODE_FNS: Record<ItemsGroupBy, GroupToNodeFn> = {
  "level": n => `Level ${n}`,
                // Undo the reverse order:
  "jlpt" : n => JLPT_LEVEL_NAMES[(5 - n) as JlptLevels],
  "joyo" : n => JOYO_GRADE_NAMES[n as JoyoGrades],
  "freq" : (n, g) => `${nts((n * g) + 1)}-${nts((n * g) + g)}`,
  "type" : n => startCase(numberToSubjectType(n)),
  "srs"  : n => startCase(stringifySrsStage(n)),
  "none" : () => "All items",
};
