// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";
import { theme } from "antd";
import { red, orange, yellow, lime, green, blue, PalettesProps } from "@ant-design/colors";

import { TinyColor } from "@ctrl/tinycolor";

import { colorToRgbOnly, fadeColor } from "./themeUtil.ts";
import { useThemeContext } from "./ThemeContext.tsx";

const { useToken } = theme;

const usedAntPalettes: PalettesProps = { red, orange, yellow, lime, green, blue };

export function ApplyAntThemeVariables(): React.ReactElement | null {
  const { token } = useToken();
  const themeName = useThemeContext().theme;

  useEffect(() => {
    const properties: Record<string, string> = {
      "--antd-primary"      : token.colorPrimary,
      "--antd-success"      : token.colorSuccess,
      "--antd-link"         : token.colorLink,
      "--antd-text"         : token.colorText,
      "--antd-text-o-70"    : fadeColor(new TinyColor(token.colorText), 0.7).toRgbString(),
      "--antd-text-desc"    : token.colorTextDescription,
      "--antd-text-disabled": token.colorTextDisabled,
      "--antd-text-solid"   : token.colorTextLightSolid,
      "--antd-split"        : token.colorSplit,
      "--antd-container"    : token.colorBgContainer,
      "--antd-spotlight"    : themeName === "light" ? "#f0f0f0" : token.colorBgSpotlight,
      "--antd-header"       : themeName === "light" ? "#f0f0f0" : "#101010",
    };

    const propertiesWithAlpha: Record<string, boolean> = {
      "--antd-text"         : true,
      "--antd-text-desc"    : true,
      "--antd-text-disabled": true,
      "--antd-split"        : true,
    };

    // Add the colors from the antd color palette
    for (const colorName in usedAntPalettes) {
      const palette = usedAntPalettes[colorName];

      for (const shade in palette) {
        if (shade === "grey") continue;
        properties[`--antd-${colorName}-${shade}`] = palette[shade];
      }
    }

    for (const key in properties) {
      const col = properties[key];

      // Versions of the colors in the form "255, 255, 255" so they can have alpha applied by Tailwind
      if (propertiesWithAlpha[key]) {
        document.documentElement.style.setProperty(key, col);
        document.documentElement.style.setProperty(
          key + "-c",
          colorToRgbOnly(new TinyColor(col))
        );
      } else {
        document.documentElement.style.setProperty(key, colorToRgbOnly(new TinyColor(col)));
      }
    }
  }, [token, themeName]);

  return null;
}
