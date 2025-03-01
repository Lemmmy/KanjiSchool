// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

export const dashboardCardClass = "h-full flex flex-col";
export const dashboardCardBodyClass = "flex-1";
export const dashboardEmptyableCardBodyClass = (isEmpty?: boolean): string => classNames(
  dashboardCardBodyClass,
  { "flex items-center justify-center": isEmpty }
);
