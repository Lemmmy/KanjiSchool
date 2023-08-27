// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { ThemeName } from "./wkTheme.ts";
import { lsGetString } from "@utils";

interface ThemeContextRes {
  theme: ThemeName;
  setTheme?: (theme: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextRes>({
  theme: "dark",
});

interface ThemeProviderProps {
  children: (theme: ThemeName) => ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
  const [theme, setTheme] = useState<ThemeName>(() => lsGetString("siteTheme", "dark") as ThemeName);

  const res: ThemeContextRes = useMemo(() => ({
    theme,
    setTheme,
  }), [theme]);

  return <ThemeContext.Provider value={res}>
    {children(theme)}
  </ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextRes {
  return useContext(ThemeContext);
}
