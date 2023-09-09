// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { CSSProperties, useMemo } from "react";

import { PaletteName, ColorPalette, PALETTES, buildPaletteStyles } from "@global/theme";

import { useStringSetting } from "@utils";
import { useThemeContext } from "@global/theme/ThemeContext.tsx";

export const usePaletteName = (): PaletteName =>
  useStringSetting<PaletteName>("sitePalette");

export function usePalette(): ColorPalette {
  const { theme } = useThemeContext();
  const paletteName = usePaletteName();
  return PALETTES[paletteName][theme] || PALETTES[paletteName]["dark"];
}

export function usePaletteStyles(): CSSProperties {
  const palette = usePalette();
  return useMemo(() => buildPaletteStyles(palette), [palette]);
}
