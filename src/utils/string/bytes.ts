// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

const UNITS = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];

export function stringifyBytes(bytes: number | undefined, precision = 1): string {
  if (bytes === undefined) return "N/A";
  if (Math.abs(bytes) < 1024) return bytes + " B";

  let u = -1;
  const r = 10 ** precision;

  do {
    bytes /= 1024;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= 1024 && u < UNITS.length - 1);

  return `${bytes.toFixed(precision)} ${UNITS[u]}`;
}
