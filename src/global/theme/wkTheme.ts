// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { theme as AntTheme, ThemeConfig } from "antd";
import { blue } from "@ant-design/colors";
import { CSSProperties, useMemo } from "react";
import { convertKeyName } from "@global/theme/themeUtil.ts";

import Debug from "debug";
import { useThemeContext } from "@global/theme/ThemeContext.tsx";

const debug = Debug("kanjischool:colors");

export type ThemeName = "dark" | "light";
export const validThemeNames: ThemeName[] = ["dark", "light"];

const { getDesignToken } = AntTheme;
const globalToken = getDesignToken();

export interface WkTheme {
  antTheme: Partial<ThemeConfig>;

  backgroundColor         : string;
  scrollbarThumbColor     : string;
  scrollbarThumbHoverColor: string;
  scrollbarTrackColor     : string;
}

const BASE_THEME: Partial<ThemeConfig> = {
  token: {
    fontSize: 16,
    fontSizeSM: 13,
  },

  components: {
    Button: {
      contentFontSizeSM: 13
    },
    Menu: {
      activeBarBorderWidth: 0,
      itemMarginBlock: 0
    },
    Slider: {
      trackBg: blue[6],
      trackHoverBg: blue[5],
      handleColor: blue[6],
      colorPrimaryBorderHover: blue[5] // handle hover color
    }
  }
};

const THEME_LIGHT: WkTheme = {
  antTheme: {
    ...BASE_THEME,
    algorithm: AntTheme.defaultAlgorithm,

    token: {
      ...BASE_THEME.token,
      colorSplit: "rgba(0, 0, 0, 0.12)",
    },

    components: {
      ...BASE_THEME.components,
      Tooltip: {
        colorBgSpotlight: "#f0f0f0",
        colorTextLightSolid: globalToken.colorText
      },
      Divider: {
        colorSplit: "rgba(0, 0, 0, 0.15)"
      }
    }
  },

  backgroundColor         : "#f5f5f5",
  scrollbarThumbColor     : "rgba(0, 0, 0, 0.13)",
  scrollbarThumbHoverColor: "rgba(0, 0, 0, 0.24)",
  scrollbarTrackColor     : "rgba(0, 0, 0, 0.1)",
};

const THEME_DARK: WkTheme = {
  antTheme: {
    ...BASE_THEME,
    algorithm: AntTheme.darkAlgorithm
  },

  backgroundColor         : "#000000",
  scrollbarThumbColor     : "rgba(255, 255, 255, 0.17)",
  scrollbarThumbHoverColor: "rgba(255, 255, 255, 0.3)",
  scrollbarTrackColor     : "rgba(255, 255, 255, 0.1)",
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
