// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

export function SimpleSkeleton(): JSX.Element {
  return <div className="space-y-md">
    <SkeletonRow className="w-full" />
    <SkeletonRow className="w-full" />
    <SkeletonRow className="w-full" />
    <SkeletonRow className="w-[61%]" />
  </div>;
}

interface RowProps {
  className?: string;
}

const SkeletonRow = ({ className }: RowProps): JSX.Element => <div
  className={classNames("h-md bg-white/15 light:bg-black/15 rounded-[4px] animate-pulse", className)}
/>;
