// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, useReducer, useRef, useMemo, useCallback, forwardRef, RefObject } from "react";
import classNames from "classnames";

import { clamp, range, throttle } from "lodash-es";
import useResizeObserver from "use-resize-observer";
import { UpdateTooltipFn, useGridTooltipEvents } from "@comp/subjects/lists/grid/gridTooltipHook.ts";

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
    const startIndex = clamp(
      Math.floor((top - overscanHeight) / itemHeight),
      0, itemCount
    );
    const endIndex = clamp(
      Math.floor((top + height + overscanHeight) / itemHeight),
      0, itemCount
    );

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
  scrollElement,
  simpleWindowing,
  throttleMs = 32,
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
  const innerEl = useRef<HTMLDivElement>(null);

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
  useResizeObserver<HTMLDivElement>({
    ref: scrollElement,
    onResize: ({ height }) => dispatchScroll({ type: "resize", height })
  });

  // Update the scrolling position - triggers a state change if the scrolling
  // startIndex and endIndex have changed (either onScroll or on mount). Also
  // re-runs if the scroll height changes.
  const updateScroll = useCallback(() => {
    // Virtual list element
    if (!scrollElement) return;

    // Get the bounding rect. This is only usable because of the specific
    // situation here
    if (simpleWindowing) {
      dispatchScroll({ type: "scrollTo", top: scrollElement.scrollTop });
    } else {
      const vel = innerEl.current;
      if (!vel) return;

      const rect = vel.getBoundingClientRect();
      const scrollTop = scrollElement.offsetTop - rect.top;
      dispatchScroll({ type: "scrollTo", top: scrollTop });
    }
  }, [scrollElement, simpleWindowing]);

  // Run updateScroll on mount/if the scroll height changes
  useEffect(() => {
    updateScroll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollState.height]);

  // Wrap the renderItem component to apply the scroll styles and cache it
  const renderWrappedItem = useCallback((i: number) => {
    if (itemCache.has(i)) return itemCache.get(i);

    const component = <div
      key={i}
      className={classNames("epic-virtual-list-row", rowClassName)}
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
    if (!scrollElement) {
      dispatchScroll({ type: "invalidate" });
      return;
    }

    const onScroll = throttle(updateScroll, throttleMs);
    scrollElement.addEventListener("scroll", onScroll);
    return () => { // Unbind on unmount
      onScroll.cancel();
      scrollElement.removeEventListener("scroll", onScroll);
    };
  }, [scrollElement, throttleMs, updateScroll]);

  // Number range for the items from startIndex to endIndex
  const items = range(scrollState.startIndex, scrollState.endIndex);

  const classes = classNames(className, "epic-virtual-list");

  return <div
    className="epic-virtual-list-bounding-rect"
    ref={innerEl}
  >
    <div
      className={classes}
      style={{
        position: "relative",
        height: `${itemCount * itemHeight}px`
      }}
      ref={ref}
    >
      {items.map(renderWrappedItem)}
    </div>
  </div>;
});
