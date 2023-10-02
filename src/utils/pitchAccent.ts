// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiSubject, ApiSubjectReadingBase } from "@api";

import Debug from "debug";
const debug = Debug("kanjischool:pitch-accent");

export type RawVocabAccentEntry = number | [string, number];
export type RawVocabAccentData = Record<string, RawVocabAccentEntry[]>;

/** The pitch accent pattern, derived from the accent position. accentPos is assumed zero-indexed. */
export enum PitchPattern {
  /** When accentPos is 0 */
  Heiban    = 0,
  /** When accentPos is 1 */
  Atamadaka = 1,
  /** When accentPos is less than the mora count */
  Nakadaka  = 2,
  /** When accentPos is equal to the mora count */
  Odaka     = 3,
}

export interface PitchInfo {
  /** The reading, split by mora. */
  mora: string[];

  /** The pitch accent pattern, derived from the accent position. */
  pattern: PitchPattern;

  /** The accent position, zero-indexed. */
  accentPos: number;

  /** The part of speech of this particular reading, occasionally specified. */
  partOfSpeech: string | null;
}

export interface ReadingPitchInfos {
  reading: ApiSubjectReadingBase;
  pitchInfos: PitchInfo[];
}

function splitReadingByMora(reading: string): string[] {
  const out: string[] = [];

  let current = "";
  for (const c of reading) {
    if (c !== "ゃ" && c !== "ゅ" && c !== "ょ" && c !== "ャ" && c !== "ュ" && c !== "ョ") {
      if (current) out.push(current);
      current = c;
    } else {
      current += c;
    }
  }

  if (current) out.push(current);

  return out;
}

function derivePitchPattern(moraCount: number, accentPos: number): PitchPattern | null {
  if (accentPos === 0) {
    return PitchPattern.Heiban;
  } else if (accentPos === 1) {
    return PitchPattern.Atamadaka;
  } else if (accentPos < moraCount) {
    return PitchPattern.Nakadaka;
  } else if (accentPos === moraCount) {
    return PitchPattern.Odaka;
  } else {
    return null;
  }
}

/** Get the pitch accent information for a word and reading. */
function getPitchInfosForReading(
  db: RawVocabAccentData,
  word: string,
  reading: string
): PitchInfo[] | null {
  // Find the accent position(s) in the reading database
  const entries = db[`${word}-${reading}`];
  if (!entries) return null;

  const mora = splitReadingByMora(reading);
  const moraCount = mora.length;

  const out: PitchInfo[] = [];

  for (const entry of entries) {
    if (typeof entry === "number") {
      const pattern = derivePitchPattern(moraCount, entry);
      if (pattern === null) {
        debug("invalid accent position for %s-%s: %d", word, reading, entry);
        return null;
      }

      out.push({ mora, pattern, accentPos: entry, partOfSpeech: null });
    } else {
      const [partOfSpeech, accentPos] = entry;
      const pattern = derivePitchPattern(moraCount, accentPos);
      if (pattern === null) {
        debug("invalid accent position for %s-%s (%s): %d", word, reading, partOfSpeech, entry);
        return null;
      }

      out.push({ mora, pattern, accentPos, partOfSpeech });
    }
  }

  debug("found pitch info for %s-%s: %o", word, reading, out);

  return out;
}

export function getPitchInfosForSubject(
  db: RawVocabAccentData,
  subject: ApiSubject
): ReadingPitchInfos[] | null {
  if (subject.object !== "vocabulary" && subject.object !== "kana_vocabulary") {
    debug("skipping pitch info lookup; subject is not a vocabulary item");
    return null;
  }

  const readings = subject.object === "vocabulary"
    ? subject.data.readings
    : [{ primary: true, reading: subject.data.characters ?? "" }];

  debug("subject %s has readings: %o", subject.id, readings);

  return readings.map(reading => {
    const pitchInfos = getPitchInfosForReading(db, subject.data.characters ?? "", reading.reading);
    if (!pitchInfos) return null;

    return { reading, pitchInfos };
  }).filter(x => x !== null) as ReadingPitchInfos[];
}
