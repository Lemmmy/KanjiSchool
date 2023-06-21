// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { useMemo, useCallback } from "react";
import classNames from "classnames";

import { VocabListItem, Size } from "./VocabListItem";
import {
  ApiSubjectVocabulary, StoredAssignment,
  useSubjects, useAssignments, useSubjectAssignmentIds
} from "@api";
import { SubjectRenderTooltipFn, useDefaultRenderTooltipFn } from "../tooltip/SubjectTooltip";

import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

interface Props {
  subjectIds: number[];
  hideReading?: boolean;
  size?: Size;
  innerPadding?: number;
  renderTooltip?: SubjectRenderTooltipFn;
}

const SIZE_HEIGHTS: Record<Size, number> = {
  "tiny": 64, // Unsupported
  "small": 56,
  "normal": 64
};

export function VocabList({
  subjectIds,
  size = "normal",
  innerPadding,
  renderTooltip,
  ...rest
}: Props): JSX.Element | null {
  const subjects = useSubjects();
  const assignments = useAssignments();
  const subjectAssignmentIds = useSubjectAssignmentIds();

  const renderTooltipFn = useDefaultRenderTooltipFn(renderTooltip);

  // Map the subject IDs to subjects and assignments
  const subjectIdsStr = subjectIds.map(s => s.toString()).join(",");
  const items: [ApiSubjectVocabulary, StoredAssignment | undefined][] = useMemo(() => {
    if (!subjects || !assignments || !subjectAssignmentIds) return [];
    return subjectIds.map(id => [
      subjects[id] as ApiSubjectVocabulary,
      assignments[subjectAssignmentIds[id] || -1]
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects, assignments, subjectAssignmentIds, subjectIdsStr]);

  const renderItem = useCallback((i: number, itemProps?: any): JSX.Element => {
    const [subject, assignment] = items[i];
    return <VocabListItem
      key={subject.id}
      subject={subject}
      assignment={assignment}
      size={size}
      renderTooltip={renderTooltipFn}
      {...rest}
      {...itemProps}
      style={{
        ...(itemProps?.style || {}),
        paddingLeft: innerPadding,
        paddingRight: innerPadding
      }}
    />;
  }, [items, rest, size, innerPadding, renderTooltipFn]);

  if (!subjects) return null;

  // If there are more than 10 items, render the virtual list. Otherwise, render
  // the regular list.
  const isVirtual = items.length > 10;

  const classes = classNames("vocab-list", {
    "is-virtual": isVirtual
  });

  if (isVirtual) {
    return <VocabListVirtual
      classes={classes}
      items={items}
      size={size}
      renderItem={renderItem}
    />;
  } else {
    return <div className={classes}>
      {items.map((_, i) => renderItem(i))}
    </div>;
  }
}

interface VocabListVirtualProps {
  classes: string;
  items: [ApiSubjectVocabulary, StoredAssignment | undefined][];
  size: Size;
  renderItem: (i: number, itemProps?: any) => JSX.Element;
}

function VocabListVirtual({
  classes,
  items,
  size,
  renderItem
}: VocabListVirtualProps): JSX.Element {
  const Row = React.memo(({ index, style }: ListChildComponentProps) =>
    renderItem(index, { style }));

  return <AutoSizer disableHeight>
    {({ width }) => (
      <List
        className={classes}
        itemCount={items.length}
        itemSize={SIZE_HEIGHTS[size]}
        width={width}
        height={320}
      >
        {Row}
      </List>
    )}
  </AutoSizer>;
}
