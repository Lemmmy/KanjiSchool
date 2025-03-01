// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { startSession as startSessionAction } from "@store/slices/sessionSlice.ts";

import { fetchSubjectsAudios, SubjectWithAssignment } from "@api";
import { hasReadings, isVocabularyLike } from "@utils";

import { SessionItem, SessionQuestion, SessionState, SessionType } from "./types";
import { saveSession } from "./storage";

import { pickSessionItems } from "./pick";
import { LessonOpts, ReviewOpts, SessionOpts } from "./order/options";
import { shuffleComparator, SubjectComparator } from "@utils/comparator";

import { globalNotification } from "@global/AntInterface.tsx";

import { v4 as uuidv4 } from "uuid";

import Debug from "debug";

const debug = Debug("kanjischool:session-start");

export function startSession(
  type: SessionType,
  subjectIds?: number[],
  withLessons?: boolean,
  options?: Partial<LessonOpts | ReviewOpts>
): SessionState | undefined {
  // Pick the items for this session, prepare the comparator, and sort them.
  const pick = pickSessionItems(type, options, subjectIds);
  if (!pick) {
    globalNotification.error({ message: "No subjects found to start a session." });
    return;
  }

  const [subjects, opts, comparator] = pick;
  if (!subjects || !subjects.length) {
    globalNotification.error({ message: "No subjects found to start a session." });
    return;
  }

  const uuid = uuidv4();

  // Create the lists of SessionItems and SessionQuestions.
  const [items, questions] = populateItems(subjects, opts, comparator);

  // Queue vocabulary audio download tasks
  debug("session start queueing vocabulary audio download tasks");
  const fetchAudioSubjects = subjects.map(p => p[0]) // Get just the subject
    .filter(isVocabularyLike); // Get vocabulary only
  // Honor the max audio fetch tasks setting:
  fetchSubjectsAudios(fetchAudioSubjects, true);

  debug("creating session %s with subjects %o", uuid, subjects);
  store.dispatch(startSessionAction({
    type, uuid,
    items, questions,
    comparatorOptions: opts,
    withLessons
  }));
  saveSession();

  return store.getState().session.sessionState!;
}

// function subjectIdsToSubjects(subjectIds: number[]): SubjectWithAssignment[] {
//   const { subjects, assignments, subjectAssignmentIdMap } = store.getState().sync;
//   if (!subjects) throw new Error("No subjects available yet!");
//   if (!assignments) throw new Error("No assignments available yet!");
//   return subjectIds.map(i => ([subjects[i], assignments[subjectAssignmentIdMap[i]]]));
// }

function populateItems(
  subjects: SubjectWithAssignment[],
  opts: SessionOpts,
  comparator: SubjectComparator
): [SessionItem[], SessionQuestion[]] {
  // If the options want to shuffle after selecting the questions, replace the
  // comparator. This affects the behavior of currentBucket. Since the SHUFFLE
  // comparator always returns 0, `currentBucket` will always be 0.
  if (opts.shuffleAfterSelection)
    comparator = shuffleComparator();

  // Create the SubjectItems and SessionQuestions. Using the same comparator we
  // built earlier, bucket the questions into sorting groups. The bucket number
  // starts at 0, and the comparator is ran for each subject in the (sorted)
  // list. If the comparator does not return 0 (i.e. these questions would
  // affect the order for some reason), the bucket number is incremented.
  const items: SessionItem[] = [], questions: SessionQuestion[] = [];
  let index = 0, currentBucket = 0;
  let prev: SubjectWithAssignment | undefined = undefined;
  for (const sa of subjects) {
    const [subject, assignment] = sa;
    const hasReading = hasReadings(subject);

    // If this subject is affected by the ordering, put it in a new bucket.
    if (prev !== undefined && comparator(prev, sa) !== 0)
      currentBucket++;

    // Create the new SessionItem:
    const itemId = index++;
    const item: SessionItem = {
      meaningCompleted: false,
      meaningIncorrectAnswers: 0,
      readingCompleted: !hasReading,
      readingIncorrectAnswers: 0,
      submitted: false,

      subjectId: subject.id,
      assignmentId: assignment?.id,

      // The sorting bucket for this item.
      bucket: currentBucket,

      // Set the item's order to the current list index, only used for
      // serialization. (TODO?)
      order: itemId,

      numAnswers: 0,
      choiceDelay: 0,
      putEnd: false,

      abandoned: false
    };
    items.push(item);

    // Create the SessionQuestions. There is always a meaning question:
    questions.push({ type: "meaning", itemId });
    if (hasReading) questions.push({ type: "reading", itemId });

    prev = sa;
  }

  debug("%d session items created: %o", items.length, items);
  debug("%d session questions created: %o", questions.length, questions);
  return [items, questions];
}
