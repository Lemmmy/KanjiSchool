// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiSpacedRepetitionSystems, ApiSpacedRepetitionSystem } from "@api";

import _rawJishoData from "./jisho-data.json";
import _rawSrsSystems from "./spaced-repetition-systems.json";

export type JoyoGrades = 1 | 2 | 3 | 4 | 5 | 6 | 9;
export type JlptLevels = 1 | 2 | 3 | 4 | 5;
export interface KanjiJishoData {
  joyo: JoyoGrades; // Jōyō taught in grade (grade 1-6, junior high (9))
  jlpt: JlptLevels; // JLPT level (N1-N5)
  nfr: number; // Newspaper frequency rank
  stroke: number; // Kanji stroke count
}
export type StoredKanjiJishoData = [JoyoGrades, JlptLevels, number, number];
export type JishoData = Record<string, StoredKanjiJishoData>;
export const jishoData = _rawJishoData as unknown as JishoData;

// TODO: Fetch this data from the API
export const rawSrsSystems = _rawSrsSystems as ApiSpacedRepetitionSystems;
export const srsSystems: Record<number, ApiSpacedRepetitionSystem> =
  rawSrsSystems.data.reduce((o, s) => ({ ...o, [s.id]: s }), {});
