// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import { ShortDuration } from "@comp/ShortDuration";
import { nts } from "@utils";

export function UpcomingReviewsNext(): React.ReactElement | null {
  const { nextReviewsAt, nextReviewsNow, nextReviewsCount } =
    useAppSelector(s => s.reviews.nextReviewsAvailable, shallowEqual);

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
