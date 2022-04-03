// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import {
  StoredSubjectMap, ApiSubject, ApiSubjectHasReadings, ApiSubjectKanjiReading,
  AnyReading, StoredSubject, SubjectType
} from "@api";
import { toKatakana } from "@utils";

/**
 * Determines whether or not a subject should be shown to the user. This will
 * hide subjects that were hidden, as well as subjects that are higher than the
 * user's current level. From the WK API docs:
 *
 *   It is possible for a user to have started an assignment for a subject that
 *   was later moved to a level above their current level. To exclude those
 *   assignments, filter by levels from 1 to the users current level.
 */
export function shouldShowSubject(
  userLevel: number,
  subjects: StoredSubjectMap,
  subjectIdOrSubject: ApiSubject | number
): boolean {
  const subject = typeof subjectIdOrSubject === "number"
    ? subjects[subjectIdOrSubject]
    : subjectIdOrSubject;

  return subject
    && !subject.data.hidden_at
    && subject.data.level <= userLevel;
}

/** Returns the primary meaning of a subject, or the first available meaning. */
export function getPrimaryMeaning(subject?: ApiSubject): string | undefined {
  if (!subject) return undefined;

  const { meanings } = subject.data;
  if (meanings.length === 1) return meanings[0].meaning;

  const primary = meanings.find(m => m.primary);
  return primary?.meaning || meanings[0].meaning;
}

/** Returns the primary reading of a subject, or the first available reading. */
export function getPrimaryReading(subject?: ApiSubject): string | undefined {
  if (!subject || subject.object === "radical") return undefined;

  const { readings } = subject.data;
  if (readings.length === 1) return readings[0].reading;

  const primary = readings.find(r => r.primary);
  return primary?.reading || readings[0].reading;
}

/** Returns an appropriate title for the subject: the characters, if available,
 * otherwise the primary meaning. */
export function getSubjectTitle(subject?: ApiSubject): string {
  return subject?.data.characters || getPrimaryMeaning(subject) || "Loading...";
}

/** Returns 0 for radical, 1 for kanji, and 2 for vocabulary. Mainly used for
 * sorting functions. */
export function subjectTypeToNumber(
  subjectType: SubjectType
): number {
  switch (subjectType) {
  case "radical": return 0;
  case "kanji": return 1;
  case "vocabulary": return 2;
  default: return -1;
  }
}

/** Returns "radical" for 0, "kanji" for 1, and "vocabulary" for 2. */
export function numberToSubjectType(number: number): SubjectType {
  switch (number) {
  case 0: return "radical";
  case 1: return "kanji";
  case 2: return "vocabulary";
  default: return "radical";
  }
}

/** Convert an on'yomi reading to katakana if desired. */
export function onyomiToKatakana(
  reading: AnyReading,
  onyomiInKatakana?: boolean
): string {
  const kanjiReading = reading as ApiSubjectKanjiReading;
  if (!kanjiReading.type || kanjiReading.type !== "onyomi") return reading.reading;
  return onyomiInKatakana ? toKatakana(reading.reading) : reading.reading;
}

/** Get a single meaning for this subject, i.e. the first primary meaning. */
export function getOneMeaning(subject: ApiSubject): string {
  const meanings = subject.data.meanings;
  const one = meanings.reduce((t, u) => {
    if (t.primary) return t;
    if (u.primary) return u;
    if (t.accepted_answer) return t;
    return u;
  }, meanings[0]);
  return one.meaning;
}

/** Get a single reading for this subject, i.e. the first primary reading. */
export function getOneReading(
  subject: ApiSubjectHasReadings,
  onyomiInKatakana?: boolean
): string {
  const readings = subject.data.readings;
  const one = readings.reduce((t, u) => {
    if (t.primary) return t;
    if (u.primary) return u;
    if (t.accepted_answer) return t;
    return u;
  }, readings[0]);
  return onyomiToKatakana(one, onyomiInKatakana);
}

/** Get a URL to a subject */
export function getSubjectUrl(subject?: StoredSubject): string {
  if (!subject) return "#";
  return `/${encodeURIComponent(subject.object)}/${encodeURIComponent(subject.data.slug)}`;
}
