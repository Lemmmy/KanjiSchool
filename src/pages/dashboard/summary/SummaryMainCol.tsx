// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Col, Statistic } from "antd";

import { RootState } from "@store";
import { State } from "@reducers/SyncReducer";
import { useSelector } from "react-redux";

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
  pendingKey: keyof PickByValue<State, AssignmentSubjectId[]>;
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

  const pendingCount = useSelector((s: RootState) => s.sync[pendingKey]?.length);

  return <Col span={24} sm={12} className="summary-main-col">
    <div className="top-row">
      {/* Lesson/review count */}
      <Statistic title={title} value={pendingCount} />

      <div className="spacer" />

      {/* Start session button */}
      {pendingCount > 0 && <StartSessionButton type={type} />}

      {/* If there isn't an ongoing session and there are no reviews available,
        * show when they will next be available */}
      {type === "review" && pendingCount === 0 && <UpcomingReviewsNext />}
    </div>

    {/* Available assignments section */}
    <div className="bottom-row">
      <AvailableAssignmentsTable type={type} data={available} />
    </div>
  </Col>;
}


