// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

export function groupBy<T, K extends keyof any>(els: T[], fn: (value: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const e of els) {
    const key = fn(e);
    if (out[key] === undefined) {
      out[key] = [e];
    } else {
      out[key].push(e);
    }
  }
  return out;
}
