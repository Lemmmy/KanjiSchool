// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Col, Statistic } from "antd";

import { useAppSelector } from "@store";
import { ReviewsSliceState } from "@store/slices/reviewsSlice.ts";

import { AssignmentSubjectId } from "@api";
import { SessionType } from "@session";

import { StartSessionButton } from "./StartSessionButton";
import { UpcomingReviewsNext } from "./UpcomingReviewsNext";
import { AvailableAssignments, AvailableAssignmentsTable } from "./AvailableAssignments";

import { PickByValue } from "utility-types";

interface SessionTmpl {
  title: string;
  button: string;
  hotkey: string;
  pendingKey: keyof PickByValue<ReviewsSliceState, AssignmentSubjectId[]>;
}

export const DATA: Record<Exclude<SessionType, "self_study">, SessionTmpl> = {
  lesson: {
    title: "Lessons",
    button: "Start lessons",
    hotkey: "L",
    pendingKey: "pendingLessons"
  },
  review: {
    title: "Reviews",
    button: "Start reviews",
    hotkey: "R",
    pendingKey: "pendingReviews"
  }
};

export type Type = "lesson" | "review";
interface Props {
  type: Type;
  available?: AvailableAssignments;
}

export function SummaryMainCol({ type, available }: Props): JSX.Element {
  const { title, pendingKey } = DATA[type];

  const pendingCount = useAppSelector(s => s.reviews[pendingKey]?.length);

  return <Col
    span={24}
    sm={12}
    className="p-lg border-0 border-solid border-b border-b-split last:border-b-0
      sm:border-b-0 sm:border-r sm:border-r-split last:border-r-0"
  >
    <div className="flex">
      {/* Lesson/review count */}
      <Statistic
        title={title}
        value={pendingCount}
        className="leading-none [&>.ant-statistic-title]:text-lg [&>.ant-statistic-content]:text-4xl"
      />

      <div className="flex-1" />

      {/* Start session button */}
      {pendingCount > 0 && <StartSessionButton type={type} />}

      {/* If there isn't an ongoing session and there are no reviews available,
        * show when they will next be available */}
      {type === "review" && pendingCount === 0 && <UpcomingReviewsNext />}
    </div>

    {/* Available assignments section */}
    <div>
      <AvailableAssignmentsTable type={type} data={available} />
    </div>
  </Col>;
}


