// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { AnyReading } from "@api";
import { toKatakana, isOnYomiReading } from "@utils";

export type DigraphMatch = [string, string]; // Regular kana, Small kana

const REGULAR_KANA = "あいうえおつやゆよわかけアイウエオツヤユヨワカケ";
const SMALL_KANA   = "ぁぃぅぇぉっゃゅょゎゕゖァィゥェォッャュョヮヵヶ";

function _readingMatchesDigraph(
  answer: string,
  baseline: string
): DigraphMatch | null {
  if (baseline === null || answer.length !== baseline.length) return null;

  // For each character in the answer string, see if it differs from the
  // baseline (correct) string, and if it does, check if it is a digraph match
  // (character exists in either REGULAR_KANA or SMALL_KANA).
  let regular: string | null = null, small: string | null = null;
  for (let i = 0; i < answer.length; i++) {
    const answerChar = answer.charAt(i), correctChar = baseline.charAt(i);
    if (answerChar === correctChar) continue;

    // Check if the user wrote a regular kana instead of a small kana.
    const p1 = REGULAR_KANA.indexOf(answerChar);
    if (p1 >= 0 && SMALL_KANA.charAt(p1) === correctChar) {
      regular = answerChar, small = correctChar;
      continue;
    }

    // Check if the user wrote a small kana instead of a regular kana.
    const p2 = SMALL_KANA.indexOf(answerChar);
    if (p2 >= 0 && REGULAR_KANA.charAt(p2) === correctChar) {
      regular = correctChar, small = answerChar;
      continue;
    }

    return null;
  }

  if (regular !== null) return [regular, small!];
  else return null;
}

export function readingMatchesDigraph(
  reading: AnyReading,
  answer: string
): DigraphMatch | null {
  const chars = reading.reading;
  if (isOnYomiReading(reading)) {
    // If this is an on'yomi reading, check if either the provided reading or
    // the reading converted from katakana to hiragana matches.
    return _readingMatchesDigraph(answer, chars)
      || _readingMatchesDigraph(answer, toKatakana(chars));
  } else {
    return _readingMatchesDigraph(answer, chars);
  }
}

export function readingMatches(reading: string, answer: string): boolean {
  return reading === answer || toKatakana(reading) === answer;
}
