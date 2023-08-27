// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";

import { usePaletteStyles } from "@utils/hooks";
import { useStringSetting } from "@utils";
import { ThemeName, useThemeStyles, validThemeNames } from "@global/theme/wkTheme.ts";
import { useThemeContext } from "@global/theme/ThemeContext.tsx";

export function ApplyWkTheme(): JSX.Element | null {
  const theme = useStringSetting("siteTheme") as ThemeName;
  const themeStyles = useThemeStyles();
  const paletteStyles = usePaletteStyles();
  const { theme: assignedTheme, setTheme } = useThemeContext();

  useEffect(() => {
    // Apply the theme class (light/dark)
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    // Apply the theme CSS variables (dark mode, etc.)
    for (const key in themeStyles) {
      document.documentElement.style.setProperty(key, (themeStyles as any)[key]);
    }

    // Apply the palette CSS variables (SRS colors, etc.)
    for (const key in paletteStyles) {
      document.documentElement.style.setProperty(key, (paletteStyles as any)[key]);
    }
  }, [theme, themeStyles, paletteStyles]);

  useEffect(() => {
    // Will update the antd theme when the site theme changes
    if (theme !== assignedTheme && (validThemeNames.includes(theme))) {
      setTheme?.(theme);
    }
  }, [assignedTheme, theme, setTheme]);

  return null;
}
