// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { nts } from "@utils";

export function pluralN(n: number, singular: string, plural?: string): string {
  const word = n === 1 ? singular : (plural || singular + "s");
  return `${nts(n)} ${word}`;
}
