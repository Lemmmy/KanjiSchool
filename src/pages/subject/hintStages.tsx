// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectType } from "@api";

/**
 * Radical
 * -----------------------------------------------------------------------------
 * - Show character
 * - Show name
 * - Show level
 * - Show meaning mnemonic
 * - Show used in kanji
 *
 * HS0: Only name and level. Hide meaning and kanji
 * HS1: Show meaning and kanji
 * HS2: Same as HS1
 *
 * Kanji
 * -----------------------------------------------------------------------------
 * - Show character
 * - Show name
 * - Show level
 * - Show readings at top
 * - Show on'yomi readings
 * - Show kun'yomi readings
 * - Show used radicals
 * - Show meaning mnemonic + hint
 * - Show reading mnemonic + hint
 * - Show used in vocabulary
 *
 * For meaning:
 * HS0: Only name and level
 * HS1: Name, level, used radicals, meaning/reading mnemonic (+hint?), used in
 *      vocabulary. HIDE READINGS FROM VOCABULARY
 * HS2: Show reading, on'yomi reading, kun'yomi reading, reading mnemonic
 *
 * For reading:
 * HS0: Only readings and level (NOT name), with on'yomi and kun'yomi readings
 * HS1: Reading mnemonic + hint, not name, not radicals, not vocab
 * HS2: Show name, used radicals, meaning mnemonic, vocabulary
 *
 * Vocabulary
 * -----------------------------------------------------------------------------
 * - Show characters
 * - Show name
 * - Show level
 * - Show reading
 * - Show used kanji
 * - Show meaning mnemonic
 * - Show reading mnemonic
 * - Show part of speech
 * - Show context sentences
 *
 * For meaning:
 * HS0: Only name and level. No audio
 * HS1: Name, level, used kanji (only name, no reading), meaning mnemonic
 * HS2: All. Add audio
 *
 * For reading:
 * HS0: Only reading and level, no name. Yes audio
 * HS1: Add reading mnemonic
 * HS2: All
 */
export type SubjectHintStage = 0 | 1 | 2;

export type HintStageObject = "meanings" | "meaning_mnemonic"
  | "reading_mnemonic" | "used_in_kanji" | "used_in_vocabulary"
  | "used_radicals" | "used_kanji" | "readings" | "readings_in_vocabulary"
  | "audio" | "part_of_speech" | "context_sentences" | "readings_in_kanji"
  | "visually_similar_kanji" | "visually_similar_kanji_readings"
  | "kanji_jisho" | "progression";

// For debugging purposes
export const HINT_STAGE_OBJECTS: HintStageObject[] = [
  "meanings", "meaning_mnemonic", "reading_mnemonic", "used_in_kanji",
  "used_in_vocabulary", "used_radicals", "used_kanji", "readings",
  "readings_in_vocabulary", "audio", "part_of_speech", "context_sentences",
  "readings_in_kanji", "visually_similar_kanji",
  "visually_similar_kanji_readings", "kanji_jisho", "progression"
];

export const HINT_STAGES: Record<SubjectType, Record<"meaning" | "reading", Record<SubjectHintStage, Partial<Record<HintStageObject, true>>>>> = {
  radical: {
    meaning: {
      0: {
        "meanings": true
      },
      1: {
        "meanings": true,
        "meaning_mnemonic": true,
        "used_in_kanji": true
      },
      2: {
        "meanings": true,
        "meaning_mnemonic": true,
        "used_in_kanji": true,
        "progression": true
      }
    },
    reading: { 0: {}, 1: {}, 2: {} }
  },
  kanji: {
    meaning: {
      0: {
        "meanings": true
      },
      1: {
        "meanings": true,
        "used_radicals": true,
        "meaning_mnemonic": true,
        "used_in_vocabulary": true,
        "visually_similar_kanji": true
      },
      2: {
        "meanings": true,
        "readings": true,
        "used_radicals": true,
        "meaning_mnemonic": true,
        "reading_mnemonic": true,
        "used_in_vocabulary": true,
        "readings_in_vocabulary": true,
        "visually_similar_kanji": true,
        "visually_similar_kanji_readings": true,
        "kanji_jisho": true,
        "progression": true
      }
    },
    reading: {
      0: {
        "readings": true
      },
      1: {
        "readings": true,
        "reading_mnemonic": true
      },
      2: {
        "meanings": true,
        "readings": true,
        "used_radicals": true,
        "meaning_mnemonic": true,
        "reading_mnemonic": true,
        "used_in_vocabulary": true,
        "readings_in_vocabulary": true,
        "visually_similar_kanji": true,
        "visually_similar_kanji_readings": true,
        "kanji_jisho": true,
        "progression": true
      }
    },
  },
  vocabulary: {
    meaning: {
      0: {
        "meanings": true
      },
      1: {
        "meanings": true,
        "used_kanji": true,
        "meaning_mnemonic": true,
        "part_of_speech": true,
        "context_sentences": true,
      },
      2: {
        "meanings": true,
        "readings": true,
        "used_kanji": true,
        "readings_in_kanji": true,
        "meaning_mnemonic": true,
        "reading_mnemonic": true,
        "part_of_speech": true,
        "context_sentences": true,
        "audio": true,
        "progression": true
      }
    },
    reading: {
      0: {
        "readings": true
      },
      1: {
        "readings": true,
        "reading_mnemonic": true
      },
      2: {
        "meanings": true,
        "readings": true,
        "used_kanji": true,
        "readings_in_kanji": true,
        "meaning_mnemonic": true,
        "reading_mnemonic": true,
        "part_of_speech": true,
        "context_sentences": true,
        "audio": true,
        "progression": true
      }
    },
  }
};

export function shouldShowObject(
  useHintStage: boolean | undefined,
  subjectType: SubjectType,
  questionType: "meaning" | "reading" | undefined,
  hintStage: number,
  object: HintStageObject
): boolean {
  if (!useHintStage || !questionType) return true;
  return !!HINT_STAGES[subjectType][questionType][hintStage.toString() as "0" | "1" | "2"][object];
}
