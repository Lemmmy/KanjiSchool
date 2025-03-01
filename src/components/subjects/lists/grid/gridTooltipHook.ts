// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RefObject, useCallback, useEffect, useRef } from "react";

export type UpdateTooltipFn = (
  subjectId: number | null,
  assignmentId: number | null,
  event?: MouseEvent
) => void;

export function useGridTooltipEvents(
  updateFn: UpdateTooltipFn | undefined,
  mainRef: RefObject<HTMLDivElement>,
  tooltipInnerRef: RefObject<HTMLDivElement>,
): void {
  const timeoutRef = useRef<number | null>(null);

  const lastShownSubjectId = useRef<number | null>(null);

  const stopTimeout = useCallback(() => {
    const currentTimeout = timeoutRef.current;
    if (currentTimeout !== null) {
      window.clearTimeout(currentTimeout);
      timeoutRef.current = null;
    }
  }, []);

  const startTimeout = useCallback(() => {
    stopTimeout();
    timeoutRef.current = window.setTimeout(() => {
      updateFn?.(null, null);
      timeoutRef.current = null;
    }, 100);
  }, [updateFn, stopTimeout]);

  useEffect(() => {
    function mouseMoveListener(event: MouseEvent) {
      const target = event.target as HTMLElement;
      const main = mainRef.current;
      const tooltip = tooltipInnerRef.current;
      if (!updateFn || !target || !main) return;

      const currentTimeout = timeoutRef.current;
      const inTooltip = tooltip && tooltip.contains(target);
      const inMain = main.contains(target);

      if (!inTooltip && !inMain) {
        if (currentTimeout === null) {
          startTimeout();
        }

        lastShownSubjectId.current = null;
      } else {
        const subjectEl = target.closest("[data-sid]") as HTMLElement | null;
        if (!subjectEl) return;

        const subjectId = subjectEl.dataset.sid ? parseInt(subjectEl.dataset.sid) : null;
        const assignmentId = subjectEl.dataset.aid ? parseInt(subjectEl.dataset.aid) : null;

        if (currentTimeout !== null) {
          window.clearTimeout(currentTimeout);
          timeoutRef.current = null;
        }

        if (lastShownSubjectId.current === subjectId) {
          return;
        }

        if (subjectId) {
          lastShownSubjectId.current = subjectId;
          updateFn(subjectId, assignmentId ?? null, event);
        }
      }
    }

    document.addEventListener("mousemove", mouseMoveListener);

    return () => {
      document.removeEventListener("mousemove", mouseMoveListener);
    };
  }, [updateFn, mainRef, tooltipInnerRef, startTimeout]);
}
