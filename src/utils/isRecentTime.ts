// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { isAfter } from "date-fns";

export function isRecentTime(date: Date | null): boolean {
  if (!date) return true;
  return isAfter(date, new Date().getTime() - (5 * 60000));
}
