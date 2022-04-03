// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { AnyReading, ApiSubjectKanjiReading } from "@api";

/** Convert Hiragana characters in a string to Katakana. */
export function toKatakana(inp?: string): string {
  if (!inp) return "";

  let out = "";
  for (const c of inp) {
    const code = c.charCodeAt(0);
    if (code >= 0x3040 && code <= 0x3096) {
      out += String.fromCharCode(code + 0x60);
    } else {
      out += c;
    }
  }

  return out;
}

export function isKanjiReading(reading: AnyReading): reading is ApiSubjectKanjiReading {
  return (reading as ApiSubjectKanjiReading).type !== undefined;
}

export function isOnYomiReading(reading: AnyReading): boolean {
  if (!isKanjiReading(reading)) return false;
  return reading.type === "onyomi";
}

export function isKunYomiReading(reading: AnyReading): boolean {
  if (!isKanjiReading(reading)) return false;
  return reading.type === "kunyomi";
}

export function isNanoriReading(reading: AnyReading): boolean {
  if (!isKanjiReading(reading)) return false;
  return reading.type === "nanori";
}
