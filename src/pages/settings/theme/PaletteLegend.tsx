// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { PaletteName, PALETTES } from "@global/theme";
import { useThemeContext } from "@global/theme/ThemeContext.tsx";
import { ReactNode } from "react";

interface Props {
  label: ReactNode;
  paletteName: PaletteName;
}

export function PaletteLegend({ label, paletteName }: Props): React.ReactElement {
  const { theme } = useThemeContext();
  const palette = PALETTES[paletteName][theme] || PALETTES[paletteName]["dark"];

  return <div className="flex items-center gap-xs whitespace-nowrap">
    <span className="whitespace-nowrap flex-1">
      {label}
    </span>

    <span className="flex items-center gap-[2px]">
      <Square color={palette.radical} />
      <Square color={palette.kanji} />
      <Square color={palette.vocabulary} />
    </span>

    <span className="flex items-center gap-[2px]">
      <Square color={palette.srsApprentice} />
      <Square color={palette.srsGuru} />
      <Square color={palette.srsMaster} />
      <Square color={palette.srsEnlightened} />
    </span>
  </div>;
}

function Square({ color }: { color: string }): React.ReactElement {
  return <div className="w-[12px] h-[12px] rounded-sm" style={{ backgroundColor: color }}></div>;
}
