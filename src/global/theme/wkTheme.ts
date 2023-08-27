// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { theme as AntTheme, ThemeConfig } from "antd";
import { CSSProperties, useMemo } from "react";
import { convertKeyName } from "@global/theme/themeUtil.ts";

import Debug from "debug";
import { useThemeContext } from "@global/theme/ThemeContext.tsx";

const debug = Debug("kanjischool:colors");

export type ThemeName = "dark" | "light";
export const validThemeNames: ThemeName[] = ["dark", "light"];

export interface WkTheme {
  antTheme: Partial<ThemeConfig>;

  scrollbarThumbColor     : string;
  scrollbarThumbColorHover: string;
  scrollbarTrackColor     : string;
}

const BASE_THEME: Partial<ThemeConfig> = {
  token: {
    fontSize: 16,
    fontSizeSM: 13
  },

  components: {
    Menu: {
      activeBarBorderWidth: 0,
      itemMarginBlock: 0
    }
  }
};

const THEME_LIGHT: WkTheme = {
  antTheme: {
    ...BASE_THEME,
    algorithm: AntTheme.defaultAlgorithm
  },

  scrollbarThumbColor     : "rgba(0, 0, 0, 0.2)",
  scrollbarThumbColorHover: "rgba(0, 0, 0, 0.3)",
  scrollbarTrackColor     : "rgba(0, 0, 0, 0.1)"
};

const THEME_DARK: WkTheme = {
  antTheme: {
    ...BASE_THEME,
    algorithm: AntTheme.darkAlgorithm
  },

  scrollbarThumbColor     : "rgba(255, 255, 255, 0.15)",
  scrollbarThumbColorHover: "rgba(255, 255, 255, 0.3)",
  scrollbarTrackColor     : "rgba(0, 0, 0, 0.1)"
};

export const THEMES: Record<ThemeName, WkTheme> = {
  dark : THEME_DARK,
  light: THEME_LIGHT
};

type ThemeKey = Exclude<keyof WkTheme, "antTheme">;

export function getTheme(themeName?: ThemeName): WkTheme {
  return (themeName ? THEMES[themeName] : undefined) ?? THEMES["dark"];
}

export const useWkTheme = (): WkTheme => THEMES[useThemeContext().theme];

export function useThemeStyles(): CSSProperties {
  const theme = useWkTheme();
  return useMemo(() => buildThemeStyles(theme), [theme]);
}

export function buildThemeStyles(theme: WkTheme): CSSProperties {
  const props: Record<string, string> = {};

  for (const origKey in theme) {
    if (origKey === "antTheme") continue;
    props[`--wk-${convertKeyName(origKey)}`] = theme[origKey as ThemeKey];
  }

  debug("theme: %o", theme);
  debug("css vars: %o", props);

  return props as CSSProperties;
}
