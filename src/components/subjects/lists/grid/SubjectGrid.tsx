// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { ComponentType, useCallback, useMemo, useRef } from "react";
import classNames from "classnames";

import {
  StoredAssignment,
  StoredSubject,
  SubjectType,
  useAssignments,
  useSubjectAssignmentIds,
  useSubjects
} from "@api";

import { SubjectGridItemProps } from "./SubjectGridItem";
import { SubjectRenderTooltipFn, useDefaultRenderTooltipFn } from "../tooltip/SubjectTooltip";
import { useSubjectGridTooltip } from "./useSubjectGridTooltip.tsx";
import { Size } from "./style.ts";

import { GridItemRadical } from "./GridItemRadical";
import { GridItemKanji } from "./GridItemKanji";
import { GridItemVocab } from "./GridItemVocab";
import { SubjectGridVirtualDynamic } from "./SubjectGridVirtualDynamic.tsx";
import { SubjectGridVirtual } from "./SubjectGridVirtual.tsx";
import { SubjectGridSpace } from "./SubjectGridSpace.tsx";

import { SubjectGridTooltip } from "./SubjectGridTooltip.tsx";

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
  containerRef = null,
  simpleWindowing,
  overscanCount,
  className,
  ...rest
}: SubjectGridProps): JSX.Element | null {
  const subjects = useSubjects();
  const assignments = useAssignments();
  const subjectAssignmentIds = useSubjectAssignmentIds();

  const renderTooltipFn = useDefaultRenderTooltipFn(renderTooltip);

  const mainRef = useRef<HTMLDivElement>(null);
  const { showTooltip, tooltipRef, tooltipInnerRef, tooltipContents, updateTooltip } =
    useSubjectGridTooltip(subjects, assignments, subjectAssignmentIds, renderTooltipFn);

  // Sort the subjects by the order they appear in sortByStr, and try to obtain
  // their assignments.
  const subjectIdsStr = subjectIds.map(s => s.toString()).join(",");
  type Item = [StoredSubject, StoredAssignment | undefined];
  const items: Item[] = useMemo(() => {
    if (!subjects || !assignments || !subjectAssignmentIds) return [];

    // Map the subject IDs to [Subject, Assignment][]
    const items: Item[] = subjectIds
      .map(id => [
        subjects[id],
        assignments[subjectAssignmentIds[id] || -1]
      ] satisfies Item)
      .filter(([subject]) => !!subject && !subject.data.hidden_at);

    // Sort by sortByStr if it is available
    if (sortByStr) {
      items.sort(([s1], [s2]) => {
        const i1 = sortByStr.indexOf(s1.data.characters || "");
        const i2 = sortByStr.indexOf(s2.data.characters || "");
        return i1 - i2;
      });
    }

    return items;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects, assignments, subjectAssignmentIds, sortByStr, subjectIdsStr]);

  // If there are more than 20 items, render the virtual list. Otherwise, render
  // the regular list.
  const isVirtual = forceVirtual || items.length > 20;

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
      isVirtual,
      renderTooltip: renderTooltipFn,
      ...rest
    });
  }, [items, itemComponent, rest, size, hideSrs, isVirtual, renderTooltipFn]);

  const classes = useMemo(() => classNames(
    "items-start",
    className,
    {
      "justify-start": alignLeft,
      "justify-center": !alignLeft,
      "leading-none": size === "tiny"
    }
  ), [className, alignLeft, size]);

  if (!subjects) return null;

  const gridEl = isVirtual
    ? (
      // If there are vocabulary, use the dynamic virtual list. Otherwise, use the
      // fixed size one.
      React.createElement(
        hasVocabulary && size === "tiny"
          ? SubjectGridVirtualDynamic
          : SubjectGridVirtual,
        {
          classes,
          rowClassName: alignLeft ? undefined : "flex justify-center",
          items,
          size,
          hideSrs,
          innerPadding,
          renderItem,
          containerRef,
          simpleWindowing,
          overscanCount,
          updateTooltip,
          mainRef,
          tooltipInnerRef,
          ref: mainRef,
        }
      )
    )
    : (
      <SubjectGridSpace
        size={size}
        className={classes}
        padding={innerPadding}
        ref={mainRef}
        items={items}
        renderItem={renderItem}
        updateTooltip={updateTooltip}
        mainRef={mainRef}
        tooltipInnerRef={tooltipInnerRef}
      />
    );

  return <>
    {/* Subject grid */}
    {gridEl}

    {/* Tooltip */}
    <SubjectGridTooltip
      showTooltip={showTooltip}
      ref={tooltipRef}
      tooltipInnerRef={tooltipInnerRef}
      tooltipContents={tooltipContents}
    />
  </>;
}

