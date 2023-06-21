// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";

import { usePaletteStyles } from "@utils/hooks";

export function ApplyPalette(): JSX.Element | null {
  const paletteStyles = usePaletteStyles();

  useEffect(() => {
    for (const key in paletteStyles) {
      document.documentElement.style.setProperty(key, (paletteStyles as any)[key]);
    }
  }, [paletteStyles]);

  return null;
}
