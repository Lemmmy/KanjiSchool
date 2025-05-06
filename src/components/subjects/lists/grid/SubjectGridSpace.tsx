// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { forwardRef, RefObject } from "react";
import { Space } from "antd";

import { StoredAssignment, StoredSubject } from "@api";

import { Size, sizeStyles } from "./style.ts";
import { UpdateTooltipFn, useGridTooltipEvents } from "./gridTooltipHook.ts";

interface SubjectGridSpaceProps {
  size: Size;
  className: string;
  padding: number;
  items: [StoredSubject, StoredAssignment | undefined][];
  renderItem: (i: number, width?: number) => React.ReactElement;
  updateTooltip?: UpdateTooltipFn;
  mainRef: RefObject<HTMLDivElement | null>;
  tooltipInnerRef: RefObject<HTMLDivElement | null>;
}

export const SubjectGridSpace = forwardRef<HTMLDivElement, SubjectGridSpaceProps>(function SubjectGridSpace({
  size,
  className,
  padding,
  items,
  renderItem,
  updateTooltip,
  mainRef,
  tooltipInnerRef
}, ref) {
  // Mouse event hooks to update the tooltip
  useGridTooltipEvents(updateTooltip, mainRef, tooltipInnerRef);

  return <Space
    size={size !== "tiny" ? sizeStyles[size].spacing : 0}
    wrap
    className={className}
    style={{ padding }}
    ref={ref}
  >
    {items.map((_, i) => renderItem(i))}
  </Space>;
});
