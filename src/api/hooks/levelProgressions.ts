// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAppSelector } from "@store";

import { ApiLevelProgressionMap } from "@api";

export const useLevelProgressions = (): ApiLevelProgressionMap | undefined =>
  useAppSelector(s => s.levelProgressions.levelProgressions);
