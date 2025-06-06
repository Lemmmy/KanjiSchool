// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";

import { usePaletteName, usePaletteStyles } from "@utils/hooks";
import { useStringSetting } from "@utils";
import { ThemeName, useThemeStyles, validThemeNames } from "@global/theme/wkTheme.ts";
import { useThemeContext } from "@global/theme/ThemeContext.tsx";

export function ApplyWkTheme(): JSX.Element | null {
  const theme = useStringSetting("siteTheme") as ThemeName;
  const themeStyles = useThemeStyles();
  const palette = usePaletteName();
  const paletteStyles = usePaletteStyles();
  const { theme: assignedTheme, setTheme } = useThemeContext();

  useEffect(() => {
    // Apply the theme and palette classes (light/dark)
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    const paletteNamesToRemove = Array.from(document.documentElement.classList).filter(c => c.startsWith("palette-"));
    document.documentElement.classList.remove(...paletteNamesToRemove);
    document.documentElement.classList.add(`palette-${palette}`);

    document.querySelector("meta[name=theme-color]")
      ?.setAttribute("content", theme === "light" ? "#f0f0f0" : "#101010");

    // Apply the theme CSS variables (dark mode, etc.)
    for (const key in themeStyles) {
      document.documentElement.style.setProperty(key, (themeStyles as any)[key]);
    }

    // Apply the palette CSS variables (SRS colors, etc.)
    for (const key in paletteStyles) {
      document.documentElement.style.setProperty(key, (paletteStyles as any)[key]);
    }
  }, [theme, themeStyles, palette, paletteStyles]);

  useEffect(() => {
    // Will update the antd theme when the site theme changes
    if (theme !== assignedTheme && (validThemeNames.includes(theme))) {
      setTheme?.(theme);
    }
  }, [assignedTheme, theme, setTheme]);

  return null;
}
