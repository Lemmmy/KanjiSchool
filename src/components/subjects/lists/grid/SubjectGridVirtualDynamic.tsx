// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { forwardRef, useState } from "react";
import useResizeObserver from "use-resize-observer";

import { StoredAssignment, StoredSubject } from "@api";

import { sizeStyles, tinyKanaWidth, tinyVocabPadding } from "./style.ts";
import { SubjectGridVirtualProps } from "./SubjectGridVirtual.tsx";
import { EpicVirtualList, EpicVirtualListItemProps } from "@comp/EpicVirtualList.tsx";

import { isVocabularyLike } from "@utils";
import memoizee from "memoizee";

const calculateDynamicRowData = memoizee((
  width: number,
  items: [StoredSubject, StoredAssignment | undefined][],
  innerPadding: number
): [number, number][][] => {
  const style = sizeStyles["tiny"];
  const itemSpacing = style.spacing;
  const itemWidth = style.width;

  // Calculate the maximum width, based on the calculated width, removing the
  // inner padding, and a fixed width of 18px to account for browser scrollbars.
  // TODO: This scrollbar subtraction is a hack.
  const maxWidth = width - (innerPadding * 2) - 18;
  // debug("calculating dynamic row data with %d items in %d px width (really: %d px)",
  //   items.length, width, maxWidth);

  const rows: [number, number][][] = [];
  let currentRow: [number, number][] = [];
  let currentWidth = 0;

  for (let i = 0; i < items.length; i++) {
    const [s] = items[i];

    // How much space this item takes up in a row (includes the spacing)
    const thisItemWidth = isVocabularyLike(s)
      ? (s.data.characters!.length * tinyKanaWidth) + tinyVocabPadding + itemSpacing
      : itemWidth + itemSpacing;

    // Try to add it to the row
    currentWidth += thisItemWidth;
    if (currentWidth >= maxWidth && currentRow.length >= 1) {
      // Doesn't fit, start a new row.
      rows.push(currentRow);
      currentWidth = thisItemWidth;
      currentRow = [[i, thisItemWidth - itemSpacing]];
    } else {
      // Fits, add it to this row.
      currentRow.push([i, thisItemWidth - itemSpacing]);
    }
  }

  // Add the last row
  if (currentRow.length > 0) rows.push(currentRow);

  return rows;
});

export const SubjectGridVirtualDynamic = forwardRef<HTMLDivElement, SubjectGridVirtualProps>(function SubjectGridVirtualDynamic({
  classes,
  items,
  innerPadding,
  renderItem,
  containerRef,
  simpleWindowing,
  overscanCount = 2,
  updateTooltip,
  mainRef,
  tooltipInnerRef
}, forwardRef): JSX.Element {
  const rowHeight = sizeStyles["tiny"].rowHeight;

  const [width, setWidth] = useState(0);
  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width }) => setWidth(width ?? 0)
  });

  // Because vocabulary can be any width, we need to calculate all the sizes
  // in advance. Radicals and kanji will always use the standard itemWidth,
  // but vocabulary will use (chars * kanaWidth) + spacing. Figure out how
  // many items can fit per row based on this:
  const rows = calculateDynamicRowData(width, items, innerPadding);

  const Row = ({ index }: EpicVirtualListItemProps) => {
    // Add the items from this row
    return rows?.[index]?.map(([id, width]) => renderItem(id, width)) ?? [];
  };

  return <div ref={ref}> {/* Resize observer */}
    <EpicVirtualList
      className={classes}
      itemCount={rows.length}
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
