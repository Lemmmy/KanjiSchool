// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode, useCallback } from "react";
import { List, Button } from "antd";
import classNames from "classnames";

import { StoredSubject, useAssignments, useSubjectAssignmentIds } from "@api";

import { VerticalSubjectListItem } from "./VerticalSubjectListItem";
import { SubjectRenderTooltipFn, useDefaultRenderTooltipFn } from "../tooltip/SubjectTooltip";

import { FixedSizeList as VList, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

export interface ListItem {
  subject: StoredSubject;
  extra: ReactNode;
}

interface Props {
  items?: ListItem[];
  onShowAll?: () => void;
  height?: number;
  renderTooltip?: SubjectRenderTooltipFn;
  className?: string;
}

const ITEM_SIZE = 42;
const LIST_HEIGHT = 420;

export function VerticalSubjectList({
  items,
  onShowAll,
  height,
  renderTooltip,
  className
}: Props): JSX.Element {
  const assignments = useAssignments();
  const subjectAssignmentIds = useSubjectAssignmentIds();

  const renderTooltipFn = useDefaultRenderTooltipFn(renderTooltip);

  const renderItem = useCallback(({ index, style }: ListChildComponentProps<ListItem>) => {
    const item = items?.[index];
    if (!item) return <span style={style} />;

    const { subject, extra } = item;
    const assignment = assignments?.[subjectAssignmentIds?.[subject.id]];

    return <VerticalSubjectListItem
      key={subject.id}
      subject={subject}
      assignment={assignment}
      extra={extra}
      style={style}
      renderTooltip={renderTooltipFn}
    />;
  }, [items, assignments, subjectAssignmentIds, renderTooltipFn]);

  const classes = classNames(
    "[&_.ant-list-items]:overflow-y-auto [&_.ant-list-items]:max-height-[420px]", // one item is 42px
    className
  );

  return <List
    size="small"
    className={classes}
    dataSource={items ?? []}
    loadMore={onShowAll && <div className="flex justify-center mt-md">
      <Button type="link" className="w-full text-sm group" onClick={onShowAll}>
        <span className="text-desc group-hover:text-white/80 transition-colors">
          Show all...
        </span>
      </Button>
    </div>}
  >
    <AutoSizer disableHeight>
      {({ width }) => (
        items && <VList
          itemCount={items.length}
          itemSize={ITEM_SIZE}
          width={width}
          height={height ?? LIST_HEIGHT}
        >
          {renderItem}
        </VList>
      )}
    </AutoSizer>
  </List>;
}
