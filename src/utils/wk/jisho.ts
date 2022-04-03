// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { JoyoGrades, JlptLevels } from "@data";

export const JOYO_KEYS: [JoyoGrades, string][] = [
  [1, "Grade 1"],
  [2, "Grade 2"],
  [3, "Grade 3"],
  [4, "Grade 4"],
  [5, "Grade 5"],
  [6, "Grade 6"],
  [9, "Middle school"],
];
export const JOYO_GRADE_NAMES: Record<JoyoGrades, string> = {
  "1": "Grade 1",
  "2": "Grade 2",
  "3": "Grade 3",
  "4": "Grade 4",
  "5": "Grade 5",
  "6": "Grade 6",
  "9": "Middle school"
};

export const JLPT_KEYS: [JlptLevels, string][] = [
  [5, "N5"],
  [4, "N4"],
  [3, "N3"],
  [2, "N2"],
  [1, "N1"],
];
export const JLPT_LEVEL_NAMES: Record<JlptLevels, string> = {
  "5": "N5",
  "4": "N4",
  "3": "N3",
  "2": "N2",
  "1": "N1"
};
