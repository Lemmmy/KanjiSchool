// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { ApiReviewStatisticMap, ApiReviewStatistic } from "@api";

export const useReviewStatistics = (): ApiReviewStatisticMap | undefined =>
  useSelector((s: RootState) => s.sync.reviewStatistics);

export const useReviewStatisticBySubjectId = (id: number): ApiReviewStatistic | undefined =>
  useSelector((s: RootState) =>
    s.sync.reviewStatistics?.[s.sync.subjectReviewStatisticIdMap?.[id]],
  shallowEqual);
