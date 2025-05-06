// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { forwardRef, RefObject, useState } from "react";
import classNames from "classnames";
import useResizeObserver from "use-resize-observer";

import { StoredAssignment, StoredSubject } from "@api";

import { Size, sizeStyles } from "./style.ts";
import { UpdateTooltipFn } from "./gridTooltipHook.ts";
import { EpicVirtualList, EpicVirtualListItemProps } from "@comp/EpicVirtualList.tsx";

export interface SubjectGridVirtualProps {
  classes: string;
  rowClassName?: string;
  items: [StoredSubject, StoredAssignment | undefined][];
  size: Size;
  hideSrs?: boolean;
  innerPadding: number;
  renderItem: (i: number, width?: number) => React.ReactElement;
  containerRef: HTMLDivElement | null;
  simpleWindowing?: boolean;
  overscanCount?: number;
  updateTooltip: UpdateTooltipFn;
  mainRef: RefObject<HTMLDivElement | null>;
  tooltipInnerRef: RefObject<HTMLDivElement | null>;
}

export const SubjectGridVirtual = forwardRef<HTMLDivElement, SubjectGridVirtualProps>(function SubjectGridVirtual({
  classes,
  rowClassName,
  items,
  size,
  hideSrs,
  innerPadding,
  renderItem,
  containerRef,
  simpleWindowing,
  overscanCount = 2,
  updateTooltip,
  mainRef,
  tooltipInnerRef
}, forwardRef): React.ReactElement {
  const style = sizeStyles[size];
  const itemSpacing = style.spacing;
  const itemWidth = style.width;

  // Row height changes if srs is shown, get the correct row height for this
  // size
  const rowHeight = hideSrs ? style.rowHeight : style.rowHeightWithSrs;

  const [width, setWidth] = useState(0);
  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width }) => setWidth(width ?? 0)
  });

  const itemsPerRow = Math.floor((width - (innerPadding * 2)) / (itemWidth + itemSpacing));
  const rowCount = Math.ceil(items.length / itemsPerRow);

  const Row = ({ index }: EpicVirtualListItemProps) => {
    // Calculate the starting and ending index of the items in this row
    const els: React.ReactElement[] = [];
    const fromIndex = index * itemsPerRow;
    const toIndex = Math.min(fromIndex + itemsPerRow, items.length);

    // Add the items from this row
    for (let i = fromIndex; i < toIndex; i++) {
      els.push(renderItem(i));
    }

    return els;
  };

  return <div ref={ref}> {/* Resize observer */}
    <EpicVirtualList
      className={classes}
      rowClassName={style.paddingClass && rowClassName
        ? classNames(style.paddingClass, rowClassName)
        : style.paddingClass ?? rowClassName}
      itemCount={rowCount}
      itemHeight={rowHeight}
      overscanCount={overscanCount}
      scrollElement={containerRef ?? undefined}
      simpleWindowing={simpleWindowing}
      ref={forwardRef}
      updateTooltip={updateTooltip}
      mainRef={mainRef}
      tooltipInnerRef={tooltipInnerRef}
    >
      {Row}
    </EpicVirtualList>
  </div>;
});
