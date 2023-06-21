// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { useMemo, ComponentType, useCallback, useContext, useState } from "react";
import { Space } from "antd";
import classNames from "classnames";

import {
  StoredSubject, StoredAssignment, SubjectType,
  useSubjects, useAssignments, useSubjectAssignmentIds
} from "@api";

import { Size } from "./";
import { SubjectGridItemProps } from "./SubjectGridItem";
import { SubjectRenderTooltipFn, useDefaultRenderTooltipFn } from "../tooltip/SubjectTooltip";

import { GridItemRadical } from "./GridItemRadical";
import { GridItemKanji } from "./GridItemKanji";
import { GridItemVocab } from "./GridItemVocab";

import { SiteLayoutContext } from "@layout/AppLayout";
import { EpicVirtualList, EpicVirtualListItemProps } from "@comp/EpicVirtualList";
import useResizeObserver from "use-resize-observer";

import { sortBy } from "lodash-es";
import memoizee from "memoizee";
import { isVocabularyLike } from "@utils";

const SIZE_SPACING: Record<Size, number> = {
  "tiny":   2,
  "small":  4,
  "normal": 16
};

const SIZE_WIDTHS: Record<Size, number> = {
  "tiny":   36,
  "small":  76,
  "normal": 104
};

const SIZE_ROW_HEIGHTS: Record<Size, [number, number]> = {
  "tiny":   [27, 27],
  "small":  [88, 100],
  "normal": [128, 140]
};

const TINY_VOCAB_PADDING = 16;
const TINY_KANA_WIDTH = 20;

const COMPONENT_TYPES: Record<SubjectType, GridItemComponentType> = {
  "radical":         GridItemRadical,
  "kanji":           GridItemKanji,
  "vocabulary":      GridItemVocab,
  "kana_vocabulary": GridItemVocab,
};

// Props required to be implemented by a grid item component.
interface RequiredComponentTypeProps {
  subject: StoredSubject;
  assignment?: StoredAssignment;
  size?: Size;
  hideSrs?: boolean;
  width?: number;
  renderTooltip: SubjectRenderTooltipFn;
}
export type GridItemComponentType = ComponentType<RequiredComponentTypeProps>;

export interface SubjectGridPropsBase extends Omit<SubjectGridItemProps, "subject" | "assignment" | "renderTooltip"> {
  subjectIds: number[];
  sortBy?: string;
  innerPadding?: number;
  alignLeft?: boolean;
  forceVirtual?: boolean;
  hasVocabulary?: boolean;
  maxHeight?: number;
  renderTooltip?: SubjectRenderTooltipFn;
  containerRef?: HTMLDivElement | null;
  simpleWindowing?: boolean;
  overscanCount?: number;
}

export interface SubjectGridProps extends SubjectGridPropsBase {
  itemComponent?: GridItemComponentType;
  subjectIds: number[];
}

export function SubjectGrid({
  itemComponent,
  subjectIds,
  sortBy: sortByStr,
  innerPadding = 0,
  size = "normal",
  hideSrs,
  alignLeft,
  forceVirtual,
  hasVocabulary,
  renderTooltip,
  containerRef,
  simpleWindowing,
  overscanCount,
  className,
  ...rest
}: SubjectGridProps): JSX.Element | null {
  const subjects = useSubjects();
  const assignments = useAssignments();
  const subjectAssignmentIds = useSubjectAssignmentIds();

  const renderTooltipFn = useDefaultRenderTooltipFn(renderTooltip);

  const siteLayoutRef = useContext(SiteLayoutContext);
  if (!containerRef) containerRef = siteLayoutRef;

  // Sort the subjects by the order they appear in sortByStr, and try to obtain
  // their assignments.
  const subjectIdsStr = subjectIds.map(s => s.toString()).join(",");
  const items: [StoredSubject, StoredAssignment | undefined][] = useMemo(() => {
    if (!subjects || !assignments || !subjectAssignmentIds) return [];

    // Map the subject IDs to [Subject, Assignment][]
    let items: [StoredSubject, StoredAssignment | undefined][] = subjectIds.map(id => [
      subjects[id],
      assignments[subjectAssignmentIds[id] || -1]
    ]);

    // Sort by sortByStr if it is available
    if (sortByStr) {
      items = sortBy(items, ([s]) => sortByStr.indexOf(s.data.characters || ""));
    }

    return items;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects, assignments, subjectAssignmentIds, sortByStr, subjectIdsStr]);

  const renderItem = useCallback((i: number, width?: number): JSX.Element => {
    const [subject, assignment] = items[i];
    const component = itemComponent ?? COMPONENT_TYPES[subject.object];
    return React.createElement(component, {
      key: subject.id,
      subject,
      assignment,
      size,
      hideSrs,
      width,
      renderTooltip: renderTooltipFn,
      ...rest
    });
  }, [items, itemComponent, rest, size, hideSrs, renderTooltipFn]);

  if (!subjects) return null;

  // If there are more than 20 items, render the virtual list. Otherwise, render
  // the regular list.
  const isVirtual = forceVirtual || items.length > 20;

  const classes = classNames(
    "subject-grid",
    "size-" + size,
    className,
    {
      "align-left": alignLeft,
      "is-virtual": isVirtual
    });

  if (isVirtual) {
    // If there are vocabulary, use the dynamic virtual list. Otherwise, use the
    // fixed size one.
    return React.createElement(
      hasVocabulary && size === "tiny"
        ? SubjectGridVirtualDynamic : SubjectGridVirtual,
      {
        classes,
        items,
        size,
        hideSrs,
        innerPadding,
        renderItem,
        containerRef,
        simpleWindowing,
        overscanCount
      }
    );
  } else {
    return <Space
      size={size !== "tiny" ? SIZE_SPACING[size] : 0}
      wrap
      className={classes}
      style={{ padding: innerPadding }}
    >
      {items.map((_, i) => renderItem(i))}
    </Space>;
  }
}

interface SubjectGridVirtualProps {
  classes: string;
  items: [StoredSubject, StoredAssignment | undefined][];
  size: Size;
  hideSrs?: boolean;
  innerPadding: number;
  renderItem: (i: number, width?: number) => JSX.Element;
  containerRef: HTMLDivElement | null;
  simpleWindowing?: boolean;
  overscanCount?: number;
}

function SubjectGridVirtual({
  classes,
  items,
  size,
  hideSrs,
  innerPadding,
  renderItem,
  containerRef,
  simpleWindowing,
  overscanCount = 2
}: SubjectGridVirtualProps): JSX.Element {
  const itemSpacing = SIZE_SPACING[size];
  const itemWidth = SIZE_WIDTHS[size];

  // Row height changes if srs is shown, get the correct row height for this
  // size
  const rowHeight = SIZE_ROW_HEIGHTS[size][hideSrs ? 0 : 1];

  const [width, setWidth] = useState(0);
  const { ref } = useResizeObserver<HTMLDivElement>({
    onResize: ({ width }) => setWidth(width ?? 0)
  });

  const itemsPerRow = Math.floor((width - (innerPadding * 2)) / (itemWidth + itemSpacing));
  const rowCount = Math.ceil(items.length / itemsPerRow);

  const Row = ({ index }: EpicVirtualListItemProps) => {
    // Calculate the starting and ending index of the items in this row
    const els: JSX.Element[] = [];
    const fromIndex = index * itemsPerRow;
    const toIndex = Math.min(fromIndex + itemsPerRow, items.length);

    // Add the items from this row
    for (let i = fromIndex; i < toIndex; i++) {
      els.push(renderItem(i));
    }

    return els;
  };

  return <div ref={ref} className="subject-grid-resize-observer">
    <EpicVirtualList
      className={classes}
      rowClassName="virtual-list-row"
      itemCount={rowCount}
      itemHeight={rowHeight}
      overscanCount={overscanCount}
      scrollElement={containerRef ?? undefined}
      simpleWindowing={simpleWindowing}
    >
      {Row}
    </EpicVirtualList>
  </div>;
}

const calculateDynamicRowData = memoizee((
  width: number,
  items: [StoredSubject, StoredAssignment | undefined][],
  innerPadding: number
): [number, number][][] => {
  const itemSpacing = SIZE_SPACING["tiny"];
  const itemWidth = SIZE_WIDTHS["tiny"];

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
      ? (s.data.characters!.length * TINY_KANA_WIDTH) + TINY_VOCAB_PADDING + itemSpacing
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

function SubjectGridVirtualDynamic({
  classes,
  items,
  innerPadding,
  renderItem,
  containerRef,
  simpleWindowing,
  overscanCount = 2
}: SubjectGridVirtualProps): JSX.Element {
  const rowHeight = SIZE_ROW_HEIGHTS["tiny"][0];

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

  return <div ref={ref} className="subject-grid-resize-observer">
    <EpicVirtualList
      className={classes}
      rowClassName="virtual-list-row dynamic"
      itemCount={rows.length}
      itemHeight={rowHeight}
      overscanCount={overscanCount}
      scrollElement={containerRef ?? undefined}
      simpleWindowing={simpleWindowing}
    >
      {Row}
    </EpicVirtualList>
  </div>;
}
