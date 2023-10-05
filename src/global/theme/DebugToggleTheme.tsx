// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button } from "antd";
import { useThemeContext } from "@global/theme/ThemeContext.tsx";
import { setStringSetting, useStringSetting } from "@utils";
import { BulbOutlined } from "@ant-design/icons";
import { PaletteName } from "@global/theme/palette.ts";
import { AccentDiagramStyle } from "@pages/subject/readings/accentDiagramTypes.ts";

const debugTheme = localStorage.getItem("debugTheme") === "true";

export function DebugToggleTheme(): JSX.Element | null {
  if (!debugTheme) return null;
  return <DebugToggleThemeInner />;
}

function DebugToggleThemeInner(): JSX.Element {
  const { theme } = useThemeContext();
  const sitePalette = useStringSetting<PaletteName>("sitePalette");
  const accentDiagramStyle = useStringSetting<AccentDiagramStyle>("pitchAccentDiagramStyle");

  function onThemeClick() {
    setStringSetting("siteTheme", theme === "light" ? "dark" : "light", false);
  }

  function setPalette(palette: PaletteName) {
    setStringSetting("sitePalette", palette, false);
  }

  function setAccentDiagramStyle(style: AccentDiagramStyle) {
    setStringSetting("pitchAccentDiagramStyle", style, false);
  }

  return <div className="flex flex-col">
    <Button size="small" onClick={onThemeClick} icon={<BulbOutlined />} />

    <div className="flex items-center">
      <Button size="small" disabled={sitePalette === "kanjiSchool"}
        onClick={() => setPalette("kanjiSchool")}>ks</Button>
      <Button size="small" disabled={sitePalette === "fdDark"}
        onClick={() => setPalette("fdDark")}>fdd</Button>
      <Button size="small" disabled={sitePalette === "fdLight"}
        onClick={() => setPalette("fdLight")}>fdl</Button>
    </div>

    <div className="flex items-center">
      <Button size="small" disabled={accentDiagramStyle === "onkai-shiki"}
        onClick={() => setAccentDiagramStyle("onkai-shiki")}>音階式</Button>
      <Button size="small" disabled={accentDiagramStyle === "sen-shiki"}
        onClick={() => setAccentDiagramStyle("sen-shiki")}>線式</Button>
    </div>
  </div>;
}
