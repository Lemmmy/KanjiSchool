// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode, RefObject, useCallback, useEffect, useRef, useState } from "react";

import { UpdateTooltipFn } from "./gridTooltipHook.ts";
import { StoredAssignmentMap, StoredSubjectMap, SubjectAssignmentIdMap } from "@api";
import { SubjectRenderTooltipFn } from "@comp/subjects/lists/tooltip/SubjectTooltip.tsx";

interface HookRes {
  showTooltip: boolean;
  tooltipRef: RefObject<HTMLDivElement | null>;
  tooltipInnerRef: RefObject<HTMLDivElement | null>;
  tooltipContents: ReactNode | null;
  updateTooltip: UpdateTooltipFn;
}

export function useSubjectGridTooltip(
  subjects: StoredSubjectMap | undefined,
  assignments: StoredAssignmentMap | undefined,
  subjectAssignmentIds: SubjectAssignmentIdMap,
  renderTooltipFn: SubjectRenderTooltipFn
): HookRes {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDirtyEvent, setTooltipDirtyEvent] = useState<MouseEvent | null>(null);
  const [tooltipContents, setTooltipContents] = useState<ReactNode | null>(null);
  const tooltipSubjectIdRef = useRef<number | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipInnerRef = useRef<HTMLDivElement>(null);
  const tooltipElTimeoutRef = useRef<number | null>(null);

  const updateTooltip: UpdateTooltipFn = useCallback((subjectId, assignmentId, event) => {
    if (!subjects || !assignments) return;

    if (!subjectId) {
      setTooltipContents(null);
      tooltipSubjectIdRef.current = null;

      const tooltipEl = tooltipRef.current;
      if (!tooltipEl) return;

      tooltipEl.style.display = "none";

      const currentTimeout = tooltipElTimeoutRef.current;
      if (!currentTimeout) {
        tooltipElTimeoutRef.current = window.setTimeout(() => {
          setShowTooltip(false);
          tooltipElTimeoutRef.current = null;
        }, 500);
      }

      return;
    }

    if (subjectId !== tooltipSubjectIdRef.current) {
      setTooltipContents(renderTooltipFn(
        subjects[subjectId],
        assignmentId ? assignments[assignmentId] : undefined
      ));
      tooltipSubjectIdRef.current = subjectId;

      const currentTimeout = tooltipElTimeoutRef.current;
      if (currentTimeout) {
        window.clearTimeout(currentTimeout);
        tooltipElTimeoutRef.current = null;
      }

      // Position the tooltip
      if (!event) return;

      const target = event.target as HTMLElement;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      if (!rect) return;

      const tooltipEl = tooltipRef.current;
      if (!tooltipEl) {
        // Create the tooltip element if it doesn't exist yet
        setShowTooltip(true);
        setTooltipDirtyEvent(event);
        return;
      }

      tooltipEl.style.top = `${rect.top + 24 + window.scrollY}px`;
      tooltipEl.style.left = `${rect.left + (rect.width / 2)}px`;
      tooltipEl.style.display = "block";
    }
  }, [renderTooltipFn, subjects, assignments]);

  useEffect(() => {
    const subjectId = tooltipSubjectIdRef.current;
    if (subjectId && tooltipDirtyEvent) {
      tooltipSubjectIdRef.current = null; // Force update
      updateTooltip(subjectId, subjectAssignmentIds[subjectId], tooltipDirtyEvent);
      setTooltipDirtyEvent(null);
    }
  }, [tooltipDirtyEvent, updateTooltip, subjectAssignmentIds]);

  return {
    showTooltip,
    tooltipRef,
    tooltipInnerRef,
    tooltipContents,
    updateTooltip,
  };
}

