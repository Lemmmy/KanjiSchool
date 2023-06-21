// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Comparator } from "../interfaces";

export function map<T, U>(t: (item: T) => U, f: Comparator<U>): Comparator<T> {
  return (a, b) => {
    return f(t(a), t(b));
  };
}
