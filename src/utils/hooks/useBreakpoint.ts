// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

// -----------------------------------------------------------------------------
// This is essentially a combination of ant's useBreakpoint hook and
// responsiveObserve, except that it will ALWAYS return the matches. Ant's
// current implementation will return `undefined` for the breakpoints on first
// render, while it waits for a subscription to be provided. This causes a lot
// of unnecessary double renders, and in some cases can even cause errors.
//
// This file is based off of the following source code from ant-design, which is
// licensed under the MIT license:
//
// https://github.com/ant-design/ant-design/blob/077443696ba0fb708f2af81f5eb665b908d8be66/components/grid/hooks/useBreakpoint.tsx
// https://github.com/ant-design/ant-design/blob/077443696ba0fb708f2af81f5eb665b908d8be66/components/_util/responsiveObserve.ts
//
// For the full terms of the MIT license used by ant-design, see:
// https://github.com/ant-design/ant-design/blob/master/LICENSE
// -----------------------------------------------------------------------------
import ResponsiveObserve, { Breakpoint, responsiveMap } from "antd/lib/_util/responsiveObserve";
import { useEffect, useState, useRef } from "react";

import { shallowEqual } from "fast-equals";

export type ScreenMap = Record<Breakpoint, boolean>;
type SubscribeFn = (screens: ScreenMap) => void;

let screenCache: ScreenMap;

const NewResponsiveObserve = {
  ...ResponsiveObserve,

  getInitialValues(): ScreenMap {
    if (screenCache) return screenCache;

    // Get the initial values for the media queries if we don't already have
    // them.
    screenCache = {} as ScreenMap;

    let bp: Breakpoint;
    for (bp in responsiveMap) {
      const query = responsiveMap[bp];
      const mql = window.matchMedia(query);
      screenCache[bp] = !!mql.matches;
    }

    return screenCache;
  },

  subscribe(fn: SubscribeFn): number {
    // Get the current values, to fill in any 'undefined' values that may arise
    // from the original responsive listener.
    const initialValues = NewResponsiveObserve.getInitialValues();

    const token = ResponsiveObserve.subscribe(screenMap => {
      // The object gets instantiated in the definition of `listener`, so
      // mutating it here is okay. Override any undefined/missing screen entries
      // (not that this should ever happen, but the types act like it can) with
      // the initial values we got from baseResponses.
      let bp: Breakpoint;
      for (bp in responsiveMap) {
        if (screenMap[bp] === undefined)
          screenMap[bp] = initialValues[bp];
      }

      fn(screenMap as ScreenMap);
    });

    return token;
  }
};

// Similar to Grid.useBreakpoint, except it will never return any undefined
// values, and it keeps track of breakpoint equality, so it won't perform any
// unnecessary re-renders when the listeners populate the screen map.
export function useBreakpoint(): ScreenMap {
  const initialValues = NewResponsiveObserve.getInitialValues();
  const [screens, setScreens] = useState<ScreenMap>(initialValues);
  const lastScreens = useRef<ScreenMap>(initialValues);

  useEffect(() => {
    const token = NewResponsiveObserve.subscribe(screenMap => {
      // Only update the state (triggering re-renders) if the breakpoints
      // actually changed
      if (!shallowEqual(lastScreens.current, screenMap)) {
        setScreens(screenMap);
        lastScreens.current = screenMap;
      }
    });

    return () => NewResponsiveObserve.unsubscribe(token);
  }, []);

  return screens;
}
