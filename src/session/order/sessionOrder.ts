// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";

import { ApiSubjectKanji, StoredSubjectMap } from "@api";

import { SessionType } from "../";
import { SESSION_PRIORITIES } from "./SessionPriority";
import { LESSON_ORDERS } from "./LessonOrder";
import { REVIEW_ORDERS } from "./ReviewOrder";
import { LessonOpts, ReviewOpts, SessionOpts } from "./options";

import { isOverdue } from "@utils";
import { booleanCompare, reverse, queue, SubjectComparator } from "@utils/comparator";

interface HasComparator {
  getComparator: () => SubjectComparator;
}

function getSubjectComparator(
  type: SessionType,
  opts: SessionOpts
): SubjectComparator {
  const order: HasComparator = type === "lesson"
    ? LESSON_ORDERS[(opts as LessonOpts).order]
    : REVIEW_ORDERS[(opts as ReviewOpts).order];

  if (!order)
    throw new Error(`Order ${(opts as LessonOpts).order} is not valid for session type ${type}`);

  return order.getComparator();
}

/** Builds a comparator to order lessons with. */
export function buildSessionComparator(
  type: SessionType,
  opts: SessionOpts
): SubjectComparator {
  const { subjects } = store.getState().sync;
  const { user } = store.getState().auth;
  if (!subjects) throw new Error("No subjects available yet!");
  if (!user) throw new Error("No user available yet!");

  // Pick the appropriate base comparator based on the lesson type and options
  let comparator = getSubjectComparator(type, opts);
  if (opts.orderReversed) comparator = reverse(comparator);

  // For reviews and self-study, overdue items can be prioritized. The session
  // priority setting takes precedence over this.
  if (type !== "lesson" && (opts as ReviewOpts).overdueFirst) {
    const c: SubjectComparator = (a, b) => booleanCompare(isOverdue(b), isOverdue(a));
    comparator = queue([c, comparator]);
  }

  // Finally, apply the main session priority setting (e.g. radicals first).
  const userLevel = user.data.level || 1;
  const levelUpIds = getLevelUpIds(subjects, userLevel);
  const orderPriority = SESSION_PRIORITIES[opts.orderPriority];
  comparator = orderPriority.getComparator(comparator, levelUpIds, userLevel);

  return comparator;
}

/**
 * Get a collection of subject IDs that are on the level-up track:
 * current-level kanji and radicals that are locking away current-level kanji.
 */
function getLevelUpIds(
  subjects: StoredSubjectMap,
  userLevel: number
): Set<number> {
  const out = new Set<number>();

  // Find the kanji in the current level
  for (const subjectId in subjects) {
    const subject = subjects[subjectId];
    // Ignore invalid subjects, non-kanji, and non-current-level
    if (subject.data.hidden_at || subject.data.level !== userLevel
      || subject.object !== "kanji") continue;

    // Add the kanji itself
    out.add(subject.id);
    // Add the kanji's components (radicals)
    ((subject as ApiSubjectKanji).data.component_subject_ids || [])
      .forEach(out.add, out);
  }

  return out;
}
