// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, useState } from "react";
import { GlobalToken, theme } from "antd";

const { useToken } = theme;

export type Breakpoint = "xxl" | "xl" | "lg" | "md" | "sm" | "xs";
export type BreakpointMap = Record<Breakpoint, string>;

const getResponsiveMap = (token: GlobalToken): BreakpointMap => ({
  xs: `(max-width: ${token.screenXSMax}px)`,
  sm: `(min-width: ${token.screenSM}px)`,
  md: `(min-width: ${token.screenMD}px)`,
  lg: `(min-width: ${token.screenLG}px)`,
  xl: `(min-width: ${token.screenXL}px)`,
  xxl: `(min-width: ${token.screenXXL}px)`,
});

export function useSingleBreakpoint(
  breakpoint: Breakpoint,
  initialValue: boolean = true
): boolean {
  const { token } = useToken();
  const [matches, setMatches] = useState(initialValue);

  const responsiveMap = getResponsiveMap(token);
  const breakpointValue = responsiveMap[breakpoint];

  useEffect(() => {
    const media = window.matchMedia(breakpointValue);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = () => {
      setMatches(media.matches);
    };

    media.addEventListener("change", listener);

    return () => {
      media.removeEventListener("change", listener);
    };
  }, [breakpointValue, matches]);

  return matches;
}
