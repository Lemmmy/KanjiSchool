// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import { ApiReviewStatisticMap, ApiReviewStatistic } from "@api";

export const useReviewStatistics = (): ApiReviewStatisticMap | undefined =>
  useAppSelector(s => s.reviewStatistics.reviewStatistics);

export const useReviewStatisticBySubjectId = (id: number): ApiReviewStatistic | undefined =>
  useAppSelector(
    s => s.reviewStatistics.reviewStatistics?.[s.reviewStatistics.subjectReviewStatisticIdMap?.[id]],
    shallowEqual
  );
