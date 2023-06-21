// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { AnswerVerdict } from "@pages/session/checkAnswer";
import { OptimalStringAlignment } from "string-metric/dist/OptimalStringAlignment";

export type NearMatchAction = "ACCEPT" | "ACCEPT_NOTIFY" | "RETRY" | "REJECT";

const osa = new OptimalStringAlignment();

/**
 * Removes potentially troublesome characters from a meaning/reading input and
 * converts it to lowercase.
 */
export function cleanString(inp: string): string {
  // Replace all whitespace with regular spaces
  inp = inp.replace(/\s/g, " ");

  // Lower case and trim
  inp = inp.toLowerCase().trim();

  return inp;
}

/**
 * Compare two strings and return their edit distance if that edit distance is
 * within the typo lenience threshold. Based on FD.
 */
function getMatchScore(answer: string, reference: string): number {
  let threshold: number;
  switch (reference.length) {
  case 1:
  case 2:
  case 3:
    threshold = 0;
    break;
  case 4:
  case 5:
    threshold = 1;
    break;
  case 6:
  case 7:
    threshold = 2;
    break;
  default:
    threshold = Math.floor(reference.length / 7 + 2);
    break;
  }

  const score = osa.distance(answer, reference);
  return score <= threshold ? score : Number.MAX_VALUE;
}

/**
 * Match an answer against a list of candidate answers, one set of acceptable
 * answers, and one set of unacceptable answers.
 *
 * There is a match if the answer matches one of the accepted answers within a
 * dynamic edit distance, and there is no rejected answer for which the answer
 * is a better match.
 *
 * This uses an implementation of the Optimal String Alignment algorithm from
 * the string-metric package. This is similar to Levenshtein or
 * Damerau-Levenshtein, but is more flexible than the former (OSA permits
 * transpositions) and more efficient than the latter.
 *
 * Based on FD.
 */
export function fuzzyMeaningMatches(
  givenAnswer: string,
  accepted: string[],
  rejected: string[],
  nearMatchAction: NearMatchAction
): AnswerVerdict {
  const cleanAnswer = cleanString(givenAnswer);

  let bestRejectedScore = Number.MAX_VALUE;
  for (const reference of rejected) {
    const score = getMatchScore(cleanAnswer, cleanString(reference));
    if (score < bestRejectedScore) {
      bestRejectedScore = score;
    }
  }

  let bestAcceptedScore = Number.MAX_VALUE;
  let bestAcceptedAnswer: string | undefined;
  for (const reference of accepted) {
    const score = getMatchScore(cleanAnswer, cleanString(reference));
    if (score < bestAcceptedScore) {
      bestAcceptedScore = score;
      bestAcceptedAnswer = reference;
    }
  }

  if (bestAcceptedScore < Number.MAX_VALUE && bestAcceptedScore <= bestRejectedScore) {
    if (bestAcceptedScore > 0) {
      // Answer was a near match
      switch (nearMatchAction) {
      case "ACCEPT": // Silently accept
      case "ACCEPT_NOTIFY": // Accept and notify
        return { ok: true, retry: false, givenAnswer, matchedAnswer: bestAcceptedAnswer, nearMatch: true };
      case "RETRY": // User can retry (shake)
        return { ok: false, retry: true, givenAnswer, matchedAnswer: bestAcceptedAnswer };
      case "REJECT": // Mark as incorrect
        return { ok: false, retry: false, givenAnswer, matchedAnswer: bestAcceptedAnswer };
      }
    }

    // Answer was correct
    return { ok: true, retry: false, givenAnswer };
  }

  // Answer was incorrect, and user cannot retry
  return { ok: false, retry: false, givenAnswer };
}
