// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

export const lsGetKey = (key: string): string => "kanjischool-" + key;

export function lsGetString(
  key: string,
  defaultValue?: string
): string | undefined {
  const value = localStorage.getItem(lsGetKey(key));
  return value === null ? defaultValue : value;
}
export function lsSetString(key: string, value: string | null): void {
  const k = lsGetKey(key);
  if (value === null) localStorage.removeItem(k);
  else localStorage.setItem(lsGetKey(key), value);
}

export function lsGetNumber(
  key: string,
  defaultValue?: number
): number | undefined {
  const value = lsGetString(key, defaultValue?.toString());
  return value ? Number(value) : undefined;
}
export function lsSetNumber(key: string, value: number): void {
  lsSetString(key, value.toString());
}

export function lsGetBoolean(key: string, defaultValue = false): boolean {
  const value = lsGetString(key, defaultValue ? "true" : "false");
  return value === "true";
}
export function lsSetBoolean(key: string, value: boolean): void {
  lsSetString(key, value ? "true" : "false");
}

export function lsGetNumberArr(key: string): number[] {
  const value = lsGetString(key);
  if (!value) return [];
  return value.split(",").map(s => parseInt(s));
}
export function lsSetNumberArr(key: string, value: number[]): void {
  lsSetString(key, value.join(","));
}

export function lsGetObject<T>(key: string): T | undefined {
  const value = lsGetString(key);
  if (!value || value === "undefined") return undefined;
  return JSON.parse(value) as T;
}
export function lsSetObject<T>(key: string, value: T | null | undefined): void {
  if (value === undefined || value === null)
    lsSetString(key, null);
  else
    lsSetString(key, JSON.stringify(value));
}

/** Gets a number from localStorage and then decrements the stored value. The
 * values always start at -1. */
export function lsGetThenDecr(key: string): number {
  const value = lsGetNumber(key) ?? -1;
  lsSetNumber(key, value - 1);
  return value;
}
