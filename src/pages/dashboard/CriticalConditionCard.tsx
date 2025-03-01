// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect, useCallback } from "react";
import { Empty } from "antd";

import {
  useSubjects, useReviewStatistics, useAssignments, useSubjectAssignmentIds,
  StoredSubjectMap, ApiReviewStatisticMap, StoredAssignmentMap,
  SubjectAssignmentIdMap,
  ApiReviewStatistic,
  StoredSubject
} from "@api";
import { VerticalSubjectList, ListItem } from "@comp/subjects/lists/vertical";
import { StudyQueueButton } from "@comp/study-queue/StudyQueueButton";
import { SimpleCard } from "@comp/SimpleCard.tsx";
import { dashboardCardClass, dashboardEmptyableCardBodyClass } from "./sharedStyles.ts";

import { useIntegerSetting } from "@utils";
import { asc, desc, map, queue } from "@utils/comparator";

// Find 10 critical condition items
function getData(
  criticalThreshold: number,
  loadAll: boolean,
  subjects?: StoredSubjectMap,
  assignments?: StoredAssignmentMap,
  subjectAssignmentIds?: SubjectAssignmentIdMap,
  reviewStatistics?: ApiReviewStatisticMap
): [ListItem[], number[]] | undefined {
  if (!subjects || !assignments || !subjectAssignmentIds || !reviewStatistics)
    return undefined;

  // First, find any review statistics with less than 75% correct, and map them
  // with their subject. Then filter them to the ones we're interested in.
  const relevantStatistics: [ApiReviewStatistic, StoredSubject][] = [];
  for (const reviewStatisticId in reviewStatistics) {
    // Discard review statistics over 75% correct
    const reviewStatistic = reviewStatistics[reviewStatisticId];
    if (reviewStatistic.data.percentage_correct >= criticalThreshold)
      continue;

    // Get the subject and assignment
    const subject = subjects[reviewStatistic.data.subject_id];
    if (!subject) throw new Error("Review statistic refers to an invalid subject!");
    const assignment = assignments[subjectAssignmentIds[subject.id]];
    if (!assignment) continue;

    // Drop invalid and irrelevant subjects
    if (subject.data.hidden_at || assignment.data.hidden ||
      assignment.data.srs_stage < 1 || assignment.data.srs_stage >= 5 ||
      !assignment.data.unlocked_at) continue;

    relevantStatistics.push([reviewStatistic, subject]);
  }

  // Sort review statistics by percentage correct ascending, then lesson
  // position descending
  relevantStatistics.sort(queue([
    map(([r]) => r.data.percentage_correct, asc),
    map(([,s]) => s.data.lesson_position, desc)
  ]));

  // Grab the first 10 (unless loading all)
  const criticalConditionItems = relevantStatistics
    .slice(0, loadAll ? undefined : 10);

  // Generate the list items and return all the subject IDs
  return [criticalConditionItems.map(([r, s]) => ({
    subject: s,
    extra: <span>{r.data.percentage_correct}%</span>
  })), relevantStatistics.map(s => s[1].id)];
}

export default function CriticalConditionCard(): JSX.Element {
  const [showingAll, setShowingAll] = useState(false);
  const [data, setData] = useState<[ListItem[], number[]]>();

  const criticalThreshold = useIntegerSetting("dashboardCriticalThreshold");

  const subjects = useSubjects();
  const assignments = useAssignments();
  const subjectAssignmentIds = useSubjectAssignmentIds();
  const reviewStatistics = useReviewStatistics();

  // Load the data on start, or if 'show all' is clicked
  useEffect(() => setData(getData(
    criticalThreshold, showingAll,
    subjects, assignments, subjectAssignmentIds,
    reviewStatistics
  )), [criticalThreshold, showingAll, subjects, assignments, subjectAssignmentIds, reviewStatistics]);

  const onShowAll = useCallback(() => setShowingAll(true), []);

  const isEmpty = data && !data[0].length;

  return <SimpleCard
    title="Critical condition items"
    className={dashboardCardClass}
    bodyClassName={dashboardEmptyableCardBodyClass(isEmpty)}
    flush
    loading={!data}

    // Add to self-study queue button
    extra={data && data[1].length > 0 && <StudyQueueButton
      type="primary"
      size="small"
      subjectIds={data[1]}
      useShortTitle
    />}
  >
    {data && (data[0].length
      ? (
        <VerticalSubjectList
          items={data[0]}
          onShowAll={showingAll ? undefined : onShowAll}
        />
      )
      : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />)}
  </SimpleCard>;
}
