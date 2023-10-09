// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

export type Size = "tiny" | "small" | "normal";

interface SubjectGridStyle {
  spacing: number;
  width: number;
  rowHeight: number;
  rowHeightWithSrs: number;
  paddingClass?: string;
}

export const tinyVocabPadding = 16;
export const tinyKanaWidth = 20;

export const sizeStyles: Record<Size, SubjectGridStyle> = {
  tiny: {
    spacing         : 2,
    width           : 36,
    rowHeight       : 27,
    rowHeightWithSrs: 27
  },

  small: {
    spacing         : 4,
    width           : 76,
    rowHeight       : 88,
    rowHeightWithSrs: 100,
    paddingClass    : "pt-sm"
  },

  normal: {
    spacing         : 16,
    width           : 104,
    rowHeight       : 128,
    rowHeightWithSrs: 140,
    paddingClass    : "pt-sm"
  }
};
