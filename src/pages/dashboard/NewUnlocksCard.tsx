// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect, useCallback, useRef } from "react";
import { Empty } from "antd";

import { StoredAssignmentMap, StoredSubjectMap, useSubjects, useAssignments } from "@api";
import { SubjectGrid } from "@comp/subjects/lists/grid";
import ListShowAllButton from "@comp/subjects/lists/vertical/ListShowAllButton.tsx";
import { SimpleCard } from "@comp/SimpleCard.tsx";
import { dashboardCardClass, dashboardEmptyableCardBodyClass } from "./sharedStyles.ts";

import dayjs from "dayjs";

// Find the first 10 subjects unlocked/burned in the last 30 days
function getData(
  loadAll: boolean,
  dateField: "unlocked_at" | "burned_at",
  subjects?: StoredSubjectMap,
  assignments?: StoredAssignmentMap
): number[] | undefined {
  if (!subjects || !assignments) return undefined;

  const ago30d = dayjs().subtract(30, "day");

  // Filter the assignments to ones that are actually unlocked/burned
  const relevantAssignments = [];
  for (const assignmentId in assignments) {
    const assignment = assignments[assignmentId];
    // Ignore invalid assignments
    if (!assignment.data.internalShouldShow || !assignment.data[dateField])
      continue;
    relevantAssignments.push(assignment);
  }

  // Sort assignments by date unlocked/burned ascending
  relevantAssignments.sort((a, b) => -a.data[dateField]!.localeCompare(b.data[dateField]!));

  // Grab the first 75 (unless loading all) and filter out any older than 30d
  const recentUnlocks = relevantAssignments
    .slice(0, loadAll ? undefined : 75)
    .filter(a => ago30d.isBefore(a.data[dateField]!));

  // Generate the list items
  return recentUnlocks.map(a => a.data.subject_id);
}

interface Props {
  dateField: "unlocked_at" | "burned_at";
}

export default function NewUnlocksCard({ dateField }: Props): JSX.Element {
  const [innerContainerRef, setInnerContainerRef] =
    useState<HTMLDivElement | null>(null);
  const innerContainerRealRef = useRef<HTMLDivElement>(null);
  const [showingAll, setShowingAll] = useState(false);
  const [data, setData] = useState<number[]>();

  const subjects = useSubjects();
  const assignments = useAssignments();

  // Load the data on start, or if 'show all' is clicked
  useEffect(() => {
    setData(getData(showingAll, dateField, subjects, assignments));
  }, [dateField, showingAll, subjects, assignments]);

  const onShowAll = useCallback(() => {
    const oldScroll = innerContainerRealRef.current?.scrollTop ?? 0;

    setShowingAll(true);

    // Re-scroll the container to re-render it
    if (innerContainerRealRef.current) {
      innerContainerRealRef.current.scrollTop = 0;
      innerContainerRealRef.current.scrollTop = oldScroll;
    }
  }, []);

  const isEmpty = data && !data.length;

  return <SimpleCard
    title={dateField === "unlocked_at"
      ? "New unlocks in last 30d"
      : "Burned items in last 30d"}
    className={dashboardCardClass}
    bodyClassName={dashboardEmptyableCardBodyClass(isEmpty)}
    flush
    loading={!data}
  >
    {data && (data.length
      ? (
        <div
          className="h-full max-h-[253px] overflow-y-auto p-md"
          // Ref here is for the SubjectGrid, so that it can handle scroll
          // windowing correctly
          ref={r => {
            setInnerContainerRef(r);
            (innerContainerRealRef as any).current = r;
          }}
        >
          <SubjectGrid
            size="tiny"
            colorBy="type"
            subjectIds={data}
            hasVocabulary
            alignLeft
            maxHeight={221}
            containerRef={innerContainerRef}
            simpleWindowing
            overscanCount={3}
          />

          {!showingAll && <ListShowAllButton onClick={onShowAll} />}
        </div>
      )
      : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
  </SimpleCard>;
}
