// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { CSSProperties, useMemo } from "react";

import { PaletteName, ColorPalette, PALETTES, buildPaletteStyles } from "@global/theme";

import { useStringSetting } from "@utils";

export const usePaletteName = (): PaletteName =>
  useStringSetting<PaletteName>("sitePalette");

export const usePalette = (): ColorPalette => PALETTES[usePaletteName()];

export function usePaletteStyles(): CSSProperties {
  const palette = usePalette();
  const styles = useMemo(() => buildPaletteStyles(palette), [palette]);
  return styles;
}
