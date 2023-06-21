// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RootState } from "@store";
import { useSelector } from "react-redux";

import { ApiLevelProgressionMap } from "@api";

export const useLevelProgressions = (): ApiLevelProgressionMap | undefined =>
  useSelector((s: RootState) => s.sync.levelProgressions);
