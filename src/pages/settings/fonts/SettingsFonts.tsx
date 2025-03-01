// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FontSizeOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { booleanSetting, MenuItem, settingsSubGroup } from "../components/SettingsSubGroup.tsx";

import { menuItemClass } from "../components/settingsStyles.ts";
import { RandomFontList } from "./RandomFontList.tsx";

export function getFontSettingsGroup(): MenuItem {
  return settingsSubGroup(
    "Font settings",
    <FontSizeOutlined />,
    [
      booleanSetting("randomFontEnabled", "Use a random font in reviews", <>
        Using random fonts in reviews can help you learn to recognize kanji in the many different styles they can be
        written in. Enabling random fonts may affect loading time and memory usage.
      </>),
      booleanSetting("randomFontHover", "Show the default font when hovering over a random font", <>
        Only effective if random fonts are enabled. When enabled, hover over or tap the question to see it in the
        default font (Noto Sans JP).
      </>),
      booleanSetting("randomFontSeparateReadingMeaning", "Show a different random font for reading/meaning questions", <>
        If enabled, reading and meaning questions will be shown in different random fonts. Otherwise, the same font will
        be used for both.
      </>),
      booleanSetting("randomFontShowName", "Show the random font name", <>
        When a random font is used, the name of the font will be shown in the top right corner of the question.
      </>),
      {
        key: "randomFontList",
        className: classNames(
          menuItemClass,
          "!cursor-auto hover:!bg-transparent"
        ),
        label: <RandomFontList />
      }
    ]
  );
}
