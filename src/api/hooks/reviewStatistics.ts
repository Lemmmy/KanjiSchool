// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import { ApiReviewStatisticMap, ApiReviewStatistic } from "@api";

export const useReviewStatistics = (): ApiReviewStatisticMap | undefined =>
  useAppSelector(s => s.sync.reviewStatistics);

export const useReviewStatisticBySubjectId = (id: number): ApiReviewStatistic | undefined =>
  useAppSelector(
    s => s.sync.reviewStatistics?.[s.sync.subjectReviewStatisticIdMap?.[id]],
    shallowEqual
  );
