// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

export function isRecentTime(date: Date | null): boolean {
  if (!date) return true;
  return date.getTime() > new Date().getTime() - (5 * 60000);
}
