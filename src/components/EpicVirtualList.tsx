// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, useReducer, useRef, useMemo, useCallback, forwardRef, RefObject } from "react";

import { throttle } from "lodash-es";
import useResizeObserver from "use-resize-observer";
import { UpdateTooltipFn, useGridTooltipEvents } from "@comp/subjects/lists/grid/gridTooltipHook.ts";

import Debug from "debug";
const debug = Debug("kanjischool:epic-virtual-list");
const DEBUG = localStorage.getItem("virtualListDebug") === "true";

export interface EpicVirtualListItemProps {
  index: number;
}

export interface EpicVirtualListProps {
  itemCount: number;
  itemHeight: number;

  scrollElement?: HTMLDivElement;
  simpleWindowing?: boolean;

  throttleMs?: number;
  overscanCount?: number;

  className?: string;
  rowClassName?: string;

  updateTooltip?: UpdateTooltipFn;
  mainRef: RefObject<HTMLDivElement>;
  tooltipInnerRef: RefObject<HTMLDivElement>;

  // Render item function
  children: (props: EpicVirtualListItemProps) => JSX.Element | JSX.Element[] | null;
}

interface ScrollState {
  itemCount: number;
  itemHeight: number;
  overscanCount: number;

  height: number;

  startIndex: number;
  endIndex: number;
}
type ScrollAction =
  | { type: "invalidate" }
  | { type: "scrollTo"; top: number }
  | { type: "resize"; height?: number }
  | {
      type: "reset";
      itemCount: number; itemHeight: number; overscanCount: number;
      height?: number;
    };

function scrollReducer(state: ScrollState, action: ScrollAction): ScrollState {
  switch (action.type) {
  case "invalidate": return { ...state, startIndex: 0, endIndex: 0 };
  case "scrollTo": {
    const { top } = action;
    const { height, itemHeight, itemCount, overscanCount } = state;

    const overscanHeight = itemHeight * overscanCount;

    // Check the new startIndex and endIndex
    const startIndex = Math.floor((top - overscanHeight) / itemHeight);
    const endIndex = Math.floor((top + height + overscanHeight) / itemHeight);

    if (DEBUG) {
      debug(
        "scrollTo top=%o, startIndex=%o, endIndex=%o" +
        "\theight=%o, itemHeight=%o, itemCount=%o," +
        "\toverscanCount=%o, overscanHeight=%o,",
        top, startIndex, endIndex, height, itemHeight, itemCount, overscanCount, overscanHeight
      );
    }

    // If the new positions are different, update the state and trigger an
    // update. Otherwise, do nothing and return the old state.
    if (startIndex !== state.startIndex || endIndex !== state.endIndex)
      return { ...state, startIndex, endIndex };
    else return state;
  }
  case "resize":
    return { ...state, height: action.height ?? state.height ?? 1 };
  case "reset":
    return {
      ...state,
      itemCount: action.itemCount,
      itemHeight: action.itemHeight,
      overscanCount: action.overscanCount,
      height: state.height, // Don't reset the height
      startIndex: 0, endIndex: 0
    };
  }
}

export const EpicVirtualList = forwardRef<HTMLDivElement, EpicVirtualListProps>(function EpicVirtualList({
  itemCount,
  itemHeight,
  scrollElement: originalScrollElement,
  simpleWindowing,
  throttleMs = 16,
  overscanCount = 0,
  children: renderItem,
  className,
  rowClassName,
  updateTooltip,
  mainRef,
  tooltipInnerRef
}, ref) {
  // List item cache, invalidated whenever the list might've changed
  const itemCache = useMemo(() => new Map(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [itemCount, itemHeight, renderItem, rowClassName]);

  // Ref for the inner container used to measure where the list is on-screen
  const ownRef = useRef<HTMLDivElement>(null);
  const divRef = ref ?? ownRef;

  // Mouse event hooks to update the tooltip
  useGridTooltipEvents(updateTooltip, mainRef, tooltipInnerRef);

  // ScrollState containing the scrollTop and scrollHeight
  const [scrollState, dispatchScroll] = useReducer(scrollReducer, {
    itemCount, itemHeight, overscanCount,
    height: 0, startIndex: 0, endIndex: 0
  });
  // If the props change, we need to update the ScrollState
  useEffect(() => {
    dispatchScroll({ type: "reset", itemCount, itemHeight, overscanCount });
  }, [itemCount, itemHeight, overscanCount]);

  // Observe the height of the scrollElement for our inner window height
  const scrollElement = originalScrollElement ?? document.documentElement;
  const scrollEventListener = originalScrollElement ?? window;
  useResizeObserver<HTMLElement>({
    ref: scrollElement,
    onResize: ({ height }) => {
      const newHeight = originalScrollElement ? height : window.innerHeight;
      if (DEBUG) debug("onResize", originalScrollElement, height, window.innerHeight, newHeight);
      dispatchScroll({ type: "resize", height: newHeight });
    }
  });

  // Update the scrolling position - triggers a state change if the scrolling
  // startIndex and endIndex have changed (either onScroll or on mount). Also
  // re-runs if the scroll height changes.
  const updateScroll = useCallback(() => {
    // Virtual list element
    if (!scrollElement) {
      if (DEBUG) debug("no scroll element");
      return;
    }

    // Get the bounding rect. This is only usable because of the specific
    // situation here
    if (simpleWindowing) {
      if (DEBUG) debug("simpleWindowing scrollTo", scrollElement.scrollTop);
      dispatchScroll({ type: "scrollTo", top: scrollElement.scrollTop });
    } else {
      const vel = (divRef as RefObject<HTMLDivElement>)?.current;
      if (!vel) {
        if (DEBUG) debug("no ref");
        return;
      }

      const rect = vel.getBoundingClientRect();
      const scrollTop = scrollElement.offsetTop - rect.top;
      if (DEBUG) debug("scrollTo", scrollTop);
      dispatchScroll({ type: "scrollTo", top: scrollTop });
    }
  }, [scrollElement, simpleWindowing, divRef]);

  // Run updateScroll on mount/if the scroll height changes
  useEffect(() => {
    if (DEBUG) debug("updateScroll on mount");
    updateScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollState.height]);

  // Wrap the renderItem component to apply the scroll styles and cache it
  const renderWrappedItem = useCallback((i: number) => {
    if (DEBUG) debug("renderWrappedItem", i);

    if (itemCache.has(i)) return itemCache.get(i);

    const component = <div
      key={i}
      className={rowClassName}
      style={{
        position: "absolute",
        top: `${i * itemHeight}px`,
        width: "100%"
      }}
    >
      {renderItem({ index: i })}
    </div>;

    itemCache.set(i, component);

    return component;
  }, [itemCache, itemHeight, renderItem, rowClassName]);

  // Bind the scroll listener to the scrollElement to update the scrollState
  useEffect(() => {
    if (!scrollEventListener) {
      if (DEBUG) debug("no scroll element, invalidating");
      dispatchScroll({ type: "invalidate" });
      return;
    }

    if (DEBUG) debug("mounting scroll listener to el %o", scrollEventListener);
    const onScroll = throttle(updateScroll, throttleMs);
    scrollEventListener.addEventListener("scroll", onScroll);

    return () => { // Unbind on unmount
      if (DEBUG) debug("unmounting scroll listener");
      onScroll.cancel();
      scrollEventListener.removeEventListener("scroll", onScroll);
    };
  }, [scrollEventListener, throttleMs, updateScroll]);

  // Number range for the items from startIndex to endIndex. If the range is outside 0 <= i < itemCount, return null
  const start = Math.max(0, scrollState.startIndex);
  const end = Math.min(scrollState.endIndex, itemCount);
  const items = useMemo(() => {
    if (start < 0 && end < 0) return null;
    if (start >= itemCount && end >= itemCount) return null;
    return Array.from({ length: end - start }, (_, i) => i + start);
  }, [start, end, itemCount]);

  return <div
    className={className}
    style={{
      position: "relative",
      height: `${itemCount * itemHeight}px`
    }}
    ref={divRef}
  >
    {items && items.map(renderWrappedItem)}
  </div>;
});
