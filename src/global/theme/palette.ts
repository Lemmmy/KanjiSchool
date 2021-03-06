// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { CSSProperties } from "react";
import { kebabCase } from "lodash";
import { TinyColor, mostReadable } from "@ctrl/tinycolor";

import Debug from "debug";
const debug = Debug("kanjischool:colors");

export interface ColorPalette {
  radical   : string;
  kanji     : string;
  vocabulary: string;
  reading   : string;

  radicalDark   : string;
  kanjiDark     : string;
  vocabularyDark: string;

  vocabularyHiragana: string;
  vocabularyKatakana: string;

  srsInitiate   : string;
  srsApprentice : string;
  srsApprentice1: string;
  srsApprentice2: string;
  srsApprentice3: string;
  srsApprentice4: string;
  srsPassed     : string;
  srsGuru       : string;
  srsMaster     : string;
  srsEnlightened: string;
  srsBurned     : string;
  srsLocked     : string;

  srsStageCardsText: string;
}

export const PALETTE_KANJI_SCHOOL: ColorPalette = {
  radical   : "#3C9AE8", // @blue-7
  kanji     : "#E8B339", // @gold-7
  vocabulary: "#6ABE39", // @green-7
  reading   : "rgba(255, 255, 255, 0.3)", // fade(@white, 30%)

  radicalDark   : "#177DDC", // @blue-6
  kanjiDark     : "#DE8E26",
  vocabularyDark: "#49AA19", // @green-6

  vocabularyHiragana: "#B2E58B", // @green-9
  vocabularyKatakana: "#3C8618", // @green-5

  srsInitiate   : "#959595", // fade(@white, 55%) (converted to hex)
  srsApprentice : "#3C9AE8", // @blue-7
  srsApprentice1: "#8DCFF8", // @blue-9
  srsApprentice2: "#65B7F3", // @blue-8
  srsApprentice3: "#3C9AE8", // @blue-7
  srsApprentice4: "#177DDC", // @blue-6
  srsPassed     : "#15395B", // @blue-3
  srsGuru       : "#6ABE39", // @green-7
  srsMaster     : "#E8D639", // @yellow-7
  srsEnlightened: "#E89A3C", // @orange-7
  srsBurned     : "#E84749", // @red-7
  srsLocked     : "#373737", // fade(@white, 15%) (converted to hex)

  srsStageCardsText: "var(--wktc-text-color-dark)"
};

/**
 * Took me ages to find where FD actually defines the theme colors (I wanted to
 * get them 100% correct).
 *   com.the_tinkering.wk.enums.ActiveTheme
 * Parameters are, in order:
 *   [3] - subjectTypeTextColors
 *   [3] - subjectTypeBackgroundColors
 *   [3] - subjectTypeButtonBackgroundColors
 *   [3] - subjectTypeBucketColors
 *   [7] - stageBucketColors
 *   [4] - stagePrePassedBucketColors
 *   [2] - stagePassedBucketColors
 *   [10] - levelProgressionBucketColors
 *   [6] - ankiColors
 *
 * Level progression colors are in a bit of a strange order, because some of
 * them were reserved for future expansion. See:
 *   com.the_tinkering.wk.model.LevelProgress
 * The gist is:
 *   0 - Passed
 *   1 - Apprentice IV
 *   2 -
 *   3 - Apprentice III
 *   4 -
 *   5 - Apprentice II
 *   6 -
 *   7 - Apprentice I
 *   8 - Initiate
 *   9 - Locked
 */
export const PALETTE_FD_LIGHT: ColorPalette = {
  radical   : "#0098F0", // subjectTypeBackgroundColors[0]
  kanji     : "#E80092", // subjectTypeBackgroundColors[1]
  vocabulary: "#9808F3", // subjectTypeBackgroundColors[2]
  reading   : "rgba(255, 255, 255, 0.3)", // fade(@white, 30%)

  radicalDark   : "#0098F0", // subjectTypeBackgroundColors[0]
  kanjiDark     : "#E80092", // subjectTypeBackgroundColors[1]
  vocabularyDark: "#9808F3", // subjectTypeBackgroundColors[2]

  vocabularyHiragana: "#C167FA",
  vocabularyKatakana: "#6A06A9",

  srsInitiate   : "#959595", // fade(@white, 55%) (converted to hex)
  srsApprentice : "#D80088", // stageBucketColors[2]
  srsApprentice1: "#D6AFCA", // levelProgressionBucketColors[7]
  srsApprentice2: "#CB8FB3", // levelProgressionBucketColors[5]
  srsApprentice3: "#D660AB", // levelProgressionBucketColors[3]
  srsApprentice4: "#D80088", // levelProgressionBucketColors[1]
  srsPassed     : "#621899", // levelProgressionBucketColors[0]
  srsGuru       : "#7D2893", // stageBucketColors[3]
  srsMaster     : "#2344D6", // stageBucketColors[4]
  srsEnlightened: "#0094EB", // stageBucketColors[5]
  srsBurned     : "#444444", // stageBucketColors[6]
  srsLocked     : "#373737", // fade(@white, 15%) (converted to hex)

  srsStageCardsText: "var(--wktc-text-color-light)"
};

export const PALETTE_FD_DARK: ColorPalette = {
  radical   : "#3DAEE9", // subjectTypeTextColors[0]
  kanji     : "#FDBC4B", // subjectTypeTextColors[1]
  vocabulary: "#2ECC71", // subjectTypeTextColors[2]
  reading   : "rgba(255, 255, 255, 0.3)", // fade(@white, 30%)

  // TODO: These need to be darkened, testing required
  radicalDark   : "#3DAEE9", // subjectTypeTextColors[0]
  kanjiDark     : "#FDBC4B", // subjectTypeTextColors[1]
  vocabularyDark: "#2ECC71", // subjectTypeTextColors[2]

  vocabularyHiragana: "#7EE2A8",
  vocabularyKatakana: "#208E4E",

  srsInitiate   : "#959595", // fade(@white, 55%) (converted to hex)
  srsApprentice : "#1D99F3", // stageBucketColors[2]
  srsApprentice1: "#7DC9FC", // levelProgressionBucketColors[7]
  srsApprentice2: "#5DB9F9", // levelProgressionBucketColors[5]
  srsApprentice3: "#3DA9F6", // levelProgressionBucketColors[3]
  srsApprentice4: "#0D89E3", // levelProgressionBucketColors[1]
  srsPassed     : "#1A3A45", // levelProgressionBucketColors[0]
  srsGuru       : "#1CDC9A", // stageBucketColors[3]
  srsMaster     : "#C9CE3B", // stageBucketColors[4]
  srsEnlightened: "#F67400", // stageBucketColors[5]
  srsBurned     : "#D53B49", // stageBucketColors[6]
  srsLocked     : "#373737", // fade(@white, 15%) (converted to hex)

  srsStageCardsText: "var(--wktc-text-color-dark)"
};

export const SRS_STAGE_TO_PALETTE: Record<number, keyof ColorPalette> = {
  0: "srsInitiate",
  1: "srsApprentice1",
  2: "srsApprentice2",
  3: "srsApprentice3",
  4: "srsApprentice4",
  5: "srsGuru",
  6: "srsGuru",
  7: "srsMaster",
  8: "srsEnlightened",
  9: "srsBurned",
  10: "srsLocked",
};

export type PaletteName = "kanjiSchool" | "fdLight" | "fdDark";
export const PALETTES: Record<PaletteName, ColorPalette> = {
  kanjiSchool: PALETTE_KANJI_SCHOOL,
  fdLight: PALETTE_FD_LIGHT,
  fdDark: PALETTE_FD_DARK
};

const TEXT_COLORS = ["rgba(255, 255, 255, 0.85)", "rgba(0, 0, 0, 0.85)"];

function convertKeyName(keyName: string): string {
  return kebabCase(keyName.replace(/(\d+)/, "-$1"));
}

export function getReadableTextColor(palette: ColorPalette, key: keyof ColorPalette): string {
  return mostReadable(palette[key], TEXT_COLORS, { includeFallbackColors: true })!.toHexString();
}

export function buildPaletteStyles(palette: ColorPalette): CSSProperties {
  const props: Record<string, string> = {};

  for (const origKey in palette) {
    const color = palette[origKey as keyof ColorPalette];
    props[`--wktc-${convertKeyName(origKey)}`] = color;

    // Lighten the color (for hover etc.)
    props[`--wktc-${convertKeyName(origKey)}-lighter`] =
      new TinyColor(color).lighten(7.5).toHexString();

    // Darken the color (for hover etc.)
    props[`--wktc-${convertKeyName(origKey)}-darker`] =
      new TinyColor(color).darken(7.5).toHexString();

    // Even darker color
    props[`--wktc-${convertKeyName(origKey)}-dark`] =
      new TinyColor(color).darken(15).toHexString();
  }

  debug("color palette: %o", palette);
  debug("css vars: %o", props);

  return props as CSSProperties;
}
