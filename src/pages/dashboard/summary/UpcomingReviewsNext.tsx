// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RootState } from "@store";
import { shallowEqual, useSelector } from "react-redux";

import { ShortDuration } from "@comp/ShortDuration";
import { nts } from "@utils";

export function UpcomingReviewsNext(): JSX.Element | null {
  const { nextReviewsAt, nextReviewsNow, nextReviewsCount } =
    useSelector((s: RootState) => s.sync.nextReviewsAvailable, shallowEqual);

  // Don't render if we have nothing to show
  if (!nextReviewsAt || nextReviewsCount <= 0 || nextReviewsNow) {
    return null;
  }

  return <span className="text-desc leading-none">
    <b>{nts(nextReviewsCount)}</b>
    {nextReviewsCount === 1 ? " review " : " reviews "}
    in <b><ShortDuration date={nextReviewsAt} /></b>
  </span>;
}
