// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

export function lut<T extends number | string>(data: T[]): Record<T, true> {
  const out: any = {};
  for (const v of data) out[v] = true;
  return out;
}

export function ulut<T extends number | string>(data?: T[]): Record<T, true> | undefined {
  if (!data || data.length === 0) return;
  return lut(data);
}

export function nlut<T extends number | string>(data: T[]): Record<T, 1> {
  const out: any = {};
  for (const v of data) out[v] = 1;
  return out;
}

export function unlut<T extends number | string>(data?: T[]): Record<T, 1> | undefined {
  if (!data || data.length === 0) return;
  return nlut(data);
}
