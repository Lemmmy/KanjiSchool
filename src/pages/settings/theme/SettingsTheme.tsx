// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { BgColorsOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { PaletteLegend } from "./PaletteLegend.tsx";
import { dropdownSetting, MenuItem, settingsSubGroup } from "../components/SettingsSubGroup.tsx";
import { menuItemClass } from "../components/settingsStyles.ts";
import { PalettePreview } from "@pages/settings/theme/PalettePreview.tsx";

const themeNames = [
  { value: "dark", label: "Dark (default)" },
  { value: "light", label: "Light" }
];

const paletteNames = [
  {
    value: "kanjiSchool",
    label: <PaletteLegend label="KanjiSchool (default)" paletteName="kanjiSchool" />
  },
  {
    value: "fdDark",
    label: <PaletteLegend label="FD dark palette" paletteName="fdDark" />
  },
  {
    value: "fdLight",
    label: <PaletteLegend label="FD light palette" paletteName="fdLight" />
  },
];

export function getThemeSettingsGroup(): MenuItem {
  return settingsSubGroup("Site theme", <BgColorsOutlined />, [
    dropdownSetting("siteTheme", "Site color theme", undefined, themeNames),
    dropdownSetting("sitePalette", "Color palette for SRS stages and subject types", undefined, paletteNames),
    {
      key: "palettePreview",
      className: classNames(menuItemClass, "!cursor-auto hover:!bg-transparent"),
      label: <PalettePreview />
    }
  ]);
}
