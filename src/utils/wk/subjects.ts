// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import {
  StoredSubjectMap, ApiSubject, ApiSubjectHasReadings, ApiSubjectKanjiReading,
  AnyReading, StoredSubject, SubjectType, ApiSubjectVocabularyLike,
  NormalizedSubjectType
} from "@api";

import { toKatakana } from "@utils";

export type ShouldShowSubject = true | "over-level" | "hidden";

/**
 * Determines whether a subject should be shown to the user. As of May 2022 this should only hide subjects that were
 * hidden (`hidden_at` is set), it no longer hides subjects that are above the user's level.
 *
 * Previously, per the API docs:
 *   It is possible for a user to have started an assignment for a subject that was later moved to a level above their
 *   current level. To exclude those assignments, filter by levels from 1 to the users current level.
 *
 * But as of May 2022, WaniKani now keeps higher level items in the user's review queue if they were already assigned:
 *   https://community.wanikani.com/t/higher-level-items-in-review-queue/57004
 *
 * KanjiSchool now also does this to stay consistent with subject counts on wanikani.com. Note that it will not affect
 * level-up since the subjects will now be in future levels. This change incurred an assignments version bump (4 to 5).
 */
export function shouldShowSubject(
  userLevel: number,
  subjects: StoredSubjectMap,
  subjectIdOrSubject: ApiSubject | number
): ShouldShowSubject {
  const subject = typeof subjectIdOrSubject === "number"
    ? subjects[subjectIdOrSubject]
    : subjectIdOrSubject;

  if (!subject || subject.data.hidden_at) return "hidden";
  else if (subject.data.level > userLevel) return "over-level";
  else return true;
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
  if (!subject || !hasReadings(subject)) return undefined;

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

/** Returns 0 for radical, 1 for kanji, 2 for vocabulary, and 3 for
 * kana_vocabulary. Mainly used for sorting functions. */
export function subjectTypeToNumber(subjectType: SubjectType): number {
  switch (subjectType) {
  case "radical": return 0;
  case "kanji": return 1;
  case "vocabulary": return 2;
  case "kana_vocabulary": return 3;
  default: return -1;
  }
}

/** Returns "radical" for 0, "kanji" for 1, "vocabulary" for 2, and
 * "kana_vocabulary" for 3. */
export function numberToSubjectType(number: number): SubjectType {
  switch (number) {
  case 0: return "radical";
  case 1: return "kanji";
  case 2: return "vocabulary";
  case 3: return "kana_vocabulary";
  default: return "radical";
  }
}

/** Returns 0 for radical, 1 for kanji, 2 for vocabulary and kana_vocabulary.
 * Mainly used for sorting functions. */
export function normalizedSubjectTypeToNumber(subjectType: SubjectType): number {
  switch (subjectType) {
  case "radical": return 0;
  case "kanji": return 1;
  case "vocabulary":
  case "kana_vocabulary": return 2;
  default: return -1;
  }
}

/** Returns "radical" for 0, "kanji" for 1, "vocabulary" for 2, and
 * also "vocabulary" for 3. */
export function numberToNormalizedSubjectType(number: number): NormalizedSubjectType {
  switch (number) {
  case 0: return "radical";
  case 1: return "kanji";
  case 2: return "vocabulary";
  case 3: return "vocabulary";
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
  const type = normalizeVocabType(subject.object);
  return `/${encodeURIComponent(type)}/${encodeURIComponent(subject.data.slug)}`;
}

/** Returns if the subject has readings (`kanji` or `vocabulary`). */
export function hasReadings(subject: ApiSubject): subject is ApiSubjectHasReadings {
  return subject.object === "kanji" || subject.object === "vocabulary";
}

/** Returns if the subject type is `vocabulary` or `kana_vocabulary`. */
export function isVocabularyLike(subject: ApiSubject): subject is ApiSubjectVocabularyLike {
  return subject.object === "vocabulary" || subject.object === "kana_vocabulary";
}

/** Returns the subject type, converting `kana_vocabulary` to `vocabulary`. */
export function normalizeVocabType(type: SubjectType): NormalizedSubjectType {
  return type === "kana_vocabulary" ? "vocabulary" : type;
}
