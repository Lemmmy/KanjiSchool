// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import { useAppSelector } from "@store";

import * as api from "@api";
import { StoredSubjectMap, StoredAssignmentMap } from "@api";

import dayjs from "dayjs";
import { normalizeVocabType, nts } from "@utils";
import classNames from "classnames";

const allZero = ([r, k, v]: Rkv): boolean => r === 0 && k === 0 && v === 0;

type Rkv = [number, number, number] // R, K, V
export interface AvailableAssignments {
  level: number;
  earlier?: Rkv;
  current?: Rkv;
}
export interface FullAvailableAssignments {
  reviews?: AvailableAssignments;
  lessons?: AvailableAssignments;
}

function getData(
  level: number,
  maxLevel: number,
  assignments: StoredAssignmentMap | undefined,
  subjects: StoredSubjectMap | undefined,
  reviewCheckTime: string | null
): FullAvailableAssignments | undefined {
  if (!assignments || !subjects) return undefined;

  const now = reviewCheckTime ? dayjs(reviewCheckTime) : dayjs();

  const data: FullAvailableAssignments = {
    reviews: { level, earlier: [0, 0, 0], current: [0, 0, 0] },
    lessons: { level, earlier: [0, 0, 0], current: [0, 0, 0] }
  };

  for (const assignmentId in assignments) {
    const assignment = assignments[assignmentId];
    // Ignore invalid and burned assignments
    if (assignment.data.hidden || !assignment.data.internalShouldShow
      || assignment.data.burned_at) continue;
    // For reviews, only show ones available now
    if (assignment.data.available_at &&
      !now.isSameOrAfter(assignment.data.available_at))
      continue;

    const subject = subjects[assignment.data.subject_id];
    // Ignore invalid subjects
    if (!subject || subject.data.hidden_at) continue;

    // If on a free subscription, remove subjects outside of max level
    if (subject.data.level > maxLevel) continue;

    // Figure out if this is a lesson or a review
    const type = assignment.data.started_at ? "reviews" : "lessons";
    // Determine which row to put this in
    const lessonRow = subject.data.level >= level ? "current" : "earlier";
    const row = data[type]![lessonRow];

    const objType = normalizeVocabType(assignment.data.subject_type);
    if (objType === "radical") row![0]++;
    else if (objType === "kanji") row![1]++;
    else if (objType === "vocabulary") row![2]++;
  }

  // Remove any all-zero rows
  if (allZero(data.lessons!.earlier!)) data.lessons!.earlier = undefined;
  if (allZero(data.lessons!.current!)) data.lessons!.current = undefined;
  if (allZero(data.reviews!.earlier!)) data.reviews!.earlier = undefined;
  if (allZero(data.reviews!.current!)) data.reviews!.current = undefined;

  if (!data.lessons!.earlier && !data.lessons!.current)
    data.lessons = undefined;
  if (!data.reviews!.earlier && !data.reviews!.current)
    data.reviews = undefined;

  // Return undefined if all the counts are zero, so none of the rows render
  return data.lessons || data.reviews ? data : undefined;
}

export function useAvailableAssignments(): FullAvailableAssignments | undefined {
  const level = api.useUserLevel();
  const maxLevel = api.useUserMaxLevel();

  const assignments = api.useAssignments();
  const subjects = api.useSubjects();
  const checkTime = useAppSelector(s => s.reviews.nextReviewsAvailable.checkTime);

  return useMemo(() => getData(level, maxLevel, assignments, subjects, checkTime),
    [level, maxLevel, assignments, subjects, checkTime]);
}

interface Props {
  type: "lesson" | "review";
  data?: AvailableAssignments;
}

const cellClass = "w-[40px] text-center";

export function AvailableAssignmentsTable({
  type,
  data
}: Props): JSX.Element | null {
  // Used to shorten the table text based on the screen size.
  const bps = useBreakpoint();

  // Don't render the table at all if there's nothing interesting to show.
  if (!data) return null;

  return <table className="mt-sm md:mt-md text-sm xxl:text-base w-full">
    <thead>
      <tr>
        <th></th>
        <th className={classNames(cellClass, "text-radical")} title="Radical">R</th>
        <th className={classNames(cellClass, "text-kanji")} title="Kanji">K</th>
        <th className={classNames(cellClass, "text-vocabulary")} title="Vocabulary">V</th>
      </tr>
    </thead>

    <tbody>
      <AssRow
        title={bps.xxl ? `Current-level ${type}s` : `Lvl ${data.level} ${type}s`}
        rkv={data.current}
      />
      <AssRow
        title={bps.xxl ? `Earlier-level ${type}s` : `Earlier ${type}s`}
        rkv={data.earlier}
      />
    </tbody>
  </table>;
}

interface AssRowProps {
  title: string;
  rkv?: Rkv;
}

const num = (n: number): string => n > 0 ? nts(n) : "";

function AssRow({
  title,
  rkv
}: AssRowProps): JSX.Element | null {
  if (!rkv) return null;
  const [r, k, v] = rkv;

  return <tr>
    <td className="text-desc">{title}</td>
    <td className={classNames(cellClass, "text-radical")}>{num(r)}</td>
    <td className={classNames(cellClass, "text-kanji")}>{num(k)}</td>
    <td className={classNames(cellClass, "text-vocabulary")}>{num(v)}</td>
  </tr>;
}
