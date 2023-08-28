// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { ShortDuration } from "@comp/ShortDuration";

export function UpcomingReviews(): JSX.Element | null {
  const { nextReviewsAt, nextReviewsNow, nextReviewsCount, nextReviewsWeek } =
    useSelector((s: RootState) => s.sync.nextReviewsAvailable, shallowEqual);

  if (!nextReviewsAt) return null;

  return <div className={"flex flex-col items-center justify-center text-lg mt-md md:mt-0"}>
    {/* Next set of reviews */}
    <div className={classNames({ "text-green": nextReviewsNow })}>
      <b>{nextReviewsCount}</b>
      {nextReviewsCount === 1 ? " review" : " reviews"}
      {nextReviewsNow
        ? <> available</>
        : <> in <b><ShortDuration date={nextReviewsAt} /></b></>}
    </div>

    {/* Total amount of reviews in the summary */}
    <div>
      <b>{nextReviewsWeek}</b> upcoming in 7d
    </div>
  </div>;
}
