// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { mostReadable, TinyColor } from "@ctrl/tinycolor";
import { ColorPalette } from "@global/theme/palette.ts";
import { kebabCase } from "@utils";

const TEXT_COLORS = ["rgba(255, 255, 255, 0.85)", "rgba(0, 0, 0, 0.85)"];

export function convertKeyName(keyName: string): string {
  return kebabCase(keyName.replace(/(\d+)/, "-$1"));
}

export function getReadableTextColor(palette: ColorPalette, key: keyof ColorPalette): string {
  return mostReadable(palette[key], TEXT_COLORS, { includeFallbackColors: true })!.toHexString();
}

export function fadeColor(c: TinyColor, amount: number): TinyColor {
  return c.setAlpha(c.getAlpha() * amount);
}

export function colorToRgbOnly(c: TinyColor): string {
  return `${c.r} ${c.g} ${c.b}`;
}
