// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Comparator } from "../interfaces";

export function condition<T>(
  cond: (item: T) => boolean,
  thenCmp: Comparator<T>,
  elseCmp: Comparator<T>
): Comparator<T> {
  return (a, b) => {
    const condA = cond(a);
    const condB = cond(b);

    if (condA) {
      if (condB) {
        return thenCmp(a, b);
      } else {
        return 1;
      }
    } else if (condB) {
      return -1;
    } else {
      return elseCmp(a, b);
    }
  };
}
