// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiSubject, ApiSubjectKanjiInner, ApiSubjectVocabularyInner } from "@api";

import { QuestionType } from "@session";
import {
  fuzzyMeaningMatches, readingMatches, DigraphMatch, readingMatchesDigraph,
  NearMatchAction,
  hasNonHiraganaKatakanaChoonpu
} from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:check-answer");

export interface AnswerVerdict {
  ok: boolean;
  retry: boolean;
  nearMatch?: boolean;
  givenAnswer: string;
  matchedAnswer?: string;
  digraphMatch?: DigraphMatch;
}

export function cleanAnswer(
  type: QuestionType,
  answer: string
): string {
  // Replace trailing 'n' with 'ん' for reading answers.
  if (type === "reading" && answer.endsWith("n"))
    answer = answer.replace(/n$/, "ん");

  answer = answer.trim();
  return answer;
}

export function checkAnswer(
  type: QuestionType,
  subject: ApiSubject,
  matchingKanji: ApiSubject | undefined,
  givenAnswer: string,
  nearMatchAction: NearMatchAction,
  meaningSynonyms?: string[]
): AnswerVerdict {
  if (type === "meaning") {
    debug("checking meaning answer for %s", givenAnswer);

    // For meanings (radical name, kanji meaning, vocab meaning), use the fuzzy
    // matcher:
    const accepted: string[] = [], rejected: string[] = [];
    for (const m of subject.data.meanings)
      (m.accepted_answer ? accepted : rejected).push(m.meaning);
    for (const m of subject.data.auxiliary_meanings)
      (m.type === "whitelist" ? accepted : rejected).push(m.meaning);

    // User-defined study materials
    if (meaningSynonyms)
      accepted.push(...meaningSynonyms);

    debug("accepted: %o  rejected: %o", accepted, rejected);

    return fuzzyMeaningMatches(givenAnswer, accepted, rejected, nearMatchAction);
    // TODO: Can do an additional check here to shake if you type the reading
    //       instead of meaning.
  } else if (type === "reading") {
    debug("checking reading answer for %s", givenAnswer);

    // For readings, check for direct equality (converting to katakana if
    // necessary):
    const readingSubject = subject.data as ApiSubjectKanjiInner | ApiSubjectVocabularyInner;

    // If the reading is an accepted answer, accept the answer (obviously)
    for (const r of readingSubject.readings) {
      if (r.accepted_answer && readingMatches(r.reading, givenAnswer))
        return { ok: true, retry: false, givenAnswer };
    }

    // If the reading is NOT an accepted answer, reject but allow retry
    for (const r of readingSubject.readings) {
      if (!r.accepted_answer && readingMatches(r.reading, givenAnswer))
        return { ok: false, retry: true, givenAnswer };
    }

    // If this is a single-kanji vocabulary, and the user types the kanji
    // reading instead of the vocabulary reading, shake and give them a chance
    // to try again:
    // TODO: matchingKanji is never passed to checkAnswer
    if (matchingKanji) {
      for (const r of (matchingKanji as Partial<ApiSubjectKanjiInner>)?.readings || []) {
        if (readingMatches(r.reading, givenAnswer)) {
          return { ok: false, retry: true, givenAnswer };
        }
      }
    }

    // Check for digraph errors, to provide a hint to the user as to why they
    // got the question wrong (つ vs っ, etc.).
    for (const r of readingSubject.readings) {
      if (r.accepted_answer) {
        const digraphMatch = readingMatchesDigraph(r, givenAnswer);
        if (digraphMatch !== null) {
          debug("reading answer matched digraph: %s/%s", digraphMatch[0], digraphMatch[1]);
          return { ok: false, retry: false, digraphMatch, givenAnswer };
        }
      }
    }

    // If the user typed any non-hiragana/katakana characters (including ー),
    // shake and give them a chance to try again. I checked all existing
    // subjects and this won't cause any problems with them, but to be on the
    // safe side, we should bypass this check if any of the readings for this
    // subject also contain any non-hiragana/katakana characters.
    let shouldLatinCheck = true;
    for (const r of readingSubject.readings) {
      if (hasNonHiraganaKatakanaChoonpu(r.reading)) {
        shouldLatinCheck = false;
        break;
      }
    }

    if (shouldLatinCheck && hasNonHiraganaKatakanaChoonpu(givenAnswer))
      return { ok: false, retry: true, givenAnswer };

    // All else failed, reject the answer.
    return { ok: false, retry: false, givenAnswer };
  } else {
    throw new Error("Invalid question type passed to checkAnswer");
  }
}
