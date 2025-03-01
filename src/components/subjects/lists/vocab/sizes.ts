// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

// "tiny" is unsupported
export type Size = "tiny" | "small" | "normal";

interface VocabListItemClasses {
  base: string;
  height: string;
  text: string;
  srs: string;
  charactersFontSize: string;
  charactersImageSize: string;
}

export const vocabListSizeClasses: Record<Size, Partial<VocabListItemClasses>> = {
  // unsupported
  "tiny": {},

  "small": {
    base: "px-xs",
    height: "h-[56px]",
    text: "text-[13px] leading-[1.2]",
    srs: "text-[11px]",
    charactersFontSize: "text-[24px]",
    charactersImageSize: "w-[24px] h-[24px]",
  },

  "normal": {
    base: "px-sm",
    height: "h-[64px]",
    text: "text-sm leading-[1.35]",
    charactersFontSize: "text-[32px]",
    charactersImageSize: "w-[32px] h-[32px]",
  },
};
