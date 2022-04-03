// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectType, SubjectWithAssignment } from "@api";
import { subjectTypeToNumber } from "@utils";
import { booleanCompare, asc, map, Comparator } from "@utils/comparator";

export type SubjectComparator = Comparator<SubjectWithAssignment>;

export const shuffleComparator: () => SubjectComparator = () => () => 0;

export const byLevel: () => SubjectComparator = () =>
  map(([aSubj]) => aSubj.data.level, asc);
export const byType: () => SubjectComparator = () =>
  map(([aSubj]) => subjectTypeToNumber(aSubj.object), asc);
export const bySrs: () => SubjectComparator = () =>
  map(([,aAss]) => aAss?.data.srs_stage ?? 10, asc);
export const byNextReview: () => SubjectComparator = () =>
  map(([,aAss]) => aAss?.data.available_at, asc);

export const typeFirst = (type: SubjectType): SubjectComparator =>
  ([aSubj], [bSubj]) => booleanCompare(
    bSubj.object === type,
    aSubj.object === type
  );
