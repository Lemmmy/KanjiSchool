// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";
import { theme } from "antd";
import { presetPalettes } from "@ant-design/colors";
import { TinyColor } from "@ctrl/tinycolor";
import { colorToRgbOnly, fadeColor } from "@global/theme/themeUtil.ts";

const { useToken } = theme;

export function ApplyAntThemeVariables(): JSX.Element | null {
  const { token } = useToken();

  useEffect(() => {
    const properties: Record<string, string> = {
      "--antd-primary"         : token.colorPrimary,
      "--antd-link"            : token.colorLink,
      "--antd-text"            : token.colorText,
      "--antd-text-o-70"       : fadeColor(new TinyColor(token.colorText), 0.7).toRgbString(),
      "--antd-text-desc"       : token.colorTextDescription,
      "--antd-text-disabled"   : token.colorTextDisabled,
      "--antd-split"           : token.colorSplit,
    };

    const propertiesWithAlpha: Record<string, boolean> = {
      "--antd-text"         : true,
      "--antd-text-desc"    : true,
      "--antd-text-disabled": true,
    };

    // Add the colors from the antd color palette
    for (const colorName in presetPalettes) {
      const palette = presetPalettes[colorName];

      for (const shade in palette) {
        properties[`--antd-${colorName}-${shade}`] = colorToRgbOnly(new TinyColor(palette[shade]));
      }
    }

    for (const key in properties) {
      document.documentElement.style.setProperty(key, properties[key]);

      // Versions of the colors in the form "255, 255, 255" so they can have alpha applied by Tailwind
      if (propertiesWithAlpha[key]) {
        document.documentElement.style.setProperty(
          key + "-c",
          colorToRgbOnly(new TinyColor(properties[key]))
        );
      }
    }
  }, [token]);

  return null;
}
