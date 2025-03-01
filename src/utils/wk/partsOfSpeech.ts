// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

export function slugifyPartOfSpeech(part: string): string {
  return part.replace(/\s+/g, "-")
    .replace(/す/g, "su")
    .replace(/る/g, "ru")
    .replace(/の/g, "no")
    .replace(/な/g, "na")
    .replace(/い/g, "i")
    .replace(/[^a-z0-9-]/g, "");
}
