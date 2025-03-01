// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { forwardRef, ReactNode, RefObject } from "react";
import { createPortal } from "react-dom";

interface Props {
  showTooltip?: boolean;
  tooltipInnerRef?: RefObject<HTMLDivElement>;
  tooltipContents?: ReactNode;
}

function stopWheel(e: React.WheelEvent<HTMLDivElement>) {
  e.preventDefault();
  return false;
}

export const SubjectGridTooltip = forwardRef<HTMLDivElement, Props>(function TooltipPortal({
  showTooltip,
  tooltipInnerRef,
  tooltipContents
}, ref): JSX.Element | null {
  return !showTooltip ? null : createPortal(<div
    ref={ref}
    className="absolute z-50 text-basec pointer-events-none w-0 h-0"
    style={{ display: "none" }}
  >
    <div
      className="relative -left-[108px] -translate-y-full pb-lg pointer-events-auto"
      ref={tooltipInnerRef}
      onWheel={stopWheel}
    >
      <div className="relative rounded shadow-md bg-spotlight !w-[200px] p-xs">
        {/* Tooltip arrow */}
        <div
          className="absolute left-1/2 bottom-0 w-[16px] h-[8px] clip-path-arrow-b
            -translate-x-1/2 translate-y-full rotate-180 bg-spotlight"
        />

        {/* Tooltip contents */}
        {tooltipContents}
      </div>
    </div>
  </div>, document.body);
});
