// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback } from "react";
import { Alert, Button, Space } from "antd";

import { useDispatch } from "react-redux";
import { useAppSelector } from "@store";
import { setOverleveledAssignments } from "@store/slices/assignmentsSlice.ts";

import { lsSetNumber, plural, pluralN } from "@utils";
import { gotoSearch, useUserLevel } from "@api";
import { useNavigate } from "react-router-dom";

export function OverleveledAssignments(): JSX.Element | null {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const level = useUserLevel();
  const over = useAppSelector(s => s.assignments.overleveledAssignments);

  const hide = useCallback(() => {
    if (!over) return;
    lsSetNumber("overleveledLessons", over.currLessons);
    lsSetNumber("overleveledReviews", over.currReviews);
    dispatch(setOverleveledAssignments(null));
  }, [dispatch, over]);

  const show = useCallback(() => {
    if (!over) return;
    hide();

    gotoSearch(navigate, {
      sortOrder: "LEVEL_THEN_TYPE",
      minLevel: level + 1,
      srsStages: [0, 1, 2, 3, 4, 5, 6, 7, 8] // Not burned
    }, true, true);
  }, [navigate, level, over, hide]);

  if (!over || (over.currLessons <= 0 && over.currReviews <= 0)) {
    return null;
  }

  const newLessons = Math.max(over.currLessons - over.prevLessons, 0);
  const newReviews = Math.max(over.currReviews - over.prevReviews, 0);

  if (newLessons <= 0 && newReviews <= 0) {
    return null;
  }

  const total = newLessons + newReviews;

  const message = newLessons > 0 && newReviews > 0
    ? <><b>{pluralN(newLessons, "lesson")}</b> and <b>{pluralN(newReviews, "review")}</b></>
    : (newLessons > 0
      ? <b>{pluralN(newLessons, "lesson")}</b>
      : <b>{pluralN(newReviews, "review")}</b>);

  return <Alert
    type="info"
    className="mb-lg"
    onClose={hide}
    closable
    message={<>
      <p className="mt-0">
        Since you last visited KanjiSchool, WaniKani have raised the {plural(total, "level")} of {message} in your
        queue. You will still be able to complete these assignments.
      </p>

      <Space direction="horizontal">
        <Button
          type="primary"
          onClick={show}
        >
          View items
        </Button>

        <Button
          href="https://community.wanikani.com/t/higher-level-items-in-review-queue/57004"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more
        </Button>

        <Button onClick={hide}>
          Hide
        </Button>
      </Space>
    </>}
  />;
}
