// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";

import { ApiReviewStatistic, StoredAssignment, StoredSubject, SubjectType, SubjectWithAssignment } from "@api";
import { PerformSearchFn } from "./KeywordSearch";
import { SearchParams } from ".";

import { ulut } from "@utils";
import dayjs, { Dayjs } from "dayjs";
import { intersection, noop } from "lodash-es";

import Debug from "debug";
const debug = Debug("kanjischool:search");

/** Subject, assignment, next review hours */
export type SearchResultItem = SubjectWithAssignment;
export type SearchResults = SearchResultItem[];

export function searchSubjects(
  params: SearchParams,
  keywordSearch: PerformSearchFn
): SearchResults {
  const { subjects, assignments, subjectAssignmentIdMap, reviewStatistics } =
    store.getState().sync;
  if (!subjects || !assignments || !subjectAssignmentIdMap || !reviewStatistics)
    throw new Error("No data available yet!");

  const now = dayjs();

  // Map the array search params to lookup tables for easier access
  const srsStagesLut = ulut(params.srsStages);
  const subjectTypesLut = ulut(params.subjectTypes);
  const jlptLevelsLut = ulut(params.jlptLevels);
  const joyoGradesLut = ulut(params.joyoGrades);

  // Prepare the subjects with their assignments and review statistics.
  // Create a mapping of subject ID -> review statistic:
  const subjectToReviewStatistics: Record<number, ApiReviewStatistic> = {};
  for (const reviewStatisticId in reviewStatistics) {
    const reviewStatistic = reviewStatistics[reviewStatisticId];
    subjectToReviewStatistics[reviewStatistic.data.subject_id] = reviewStatistic;
  }

  // Build the search list
  const results: SearchResults = [];
  function insertResult(subject: StoredSubject): void {
    const subjectId = subject.id;
    const assignment = assignments![subjectAssignmentIdMap[subjectId] || -1];
    const reviewStatistic = subjectToReviewStatistics[subjectId];

    // Apply the search parameters to filter this subject. It will return `true`
    // if the subject should appear in the results, or a number with the hours
    // until the next review, or `undefined` to not appear at all.
    const result = applySearchFilter(
      subject, assignment, reviewStatistic,
      now,
      params,
      srsStagesLut, subjectTypesLut, jlptLevelsLut, joyoGradesLut
    );

    if (result === true) // Regular result
      results.push([subject, assignment]);
  }

  if (params.query) {
    debug("searching using fuse");
    // If we are performing a keyword search, use the Fuse search function.
    // TODO: Find a better limit, or a setting for it?
    const subjectResults = keywordSearch(params.query, 50);
    for (const subject of subjectResults) {
      insertResult(subjects[subject.item.id]);
    }
  } else {
    debug("searching all subjects");
    // Otherwise, search all subjects
    for (const subjectId in subjects) {
      const subject = subjects[subjectId];
      if (!subject || subject.data.hidden_at) continue;
      insertResult(subject);
    }
  }

  return results;
}

function applySearchFilter(
  subject: StoredSubject,
  assignment: StoredAssignment,
  reviewStatistic: ApiReviewStatistic,
  now: Dayjs,
  {
    minLevel, maxLevel, minFreq, maxFreq,
    percentageCorrectLt, percentageCorrectGt,
    nextReviewLt, nextReviewGt, burnedLt, burnedGt,
    partsOfSpeech
  }: SearchParams,
  srsStagesLut: Record<number, true> | undefined,
  subjectTypesLut: Record<SubjectType, true> | undefined,
  jlptLevelsLut: Record<number, true> | undefined,
  joyoGradesLut: Record<number, true> | undefined
): true | undefined {
  // Min and max level
  if (minLevel !== undefined && subject.data.level < minLevel) return;
  if (maxLevel !== undefined && subject.data.level > maxLevel) return;

  // Min and max Jisho newspaper frequency
  if (minFreq !== undefined && (!subject.data.jisho || !subject.data.jisho.nfr || subject.data.jisho.nfr < minFreq))
    return;
  if (maxFreq !== undefined && (!subject.data.jisho || !subject.data.jisho.nfr || subject.data.jisho.nfr > maxFreq))
    return;

  noop(reviewStatistic); // TODO: Leeches

  // Percentage correct less than/more than
  if (percentageCorrectLt !== undefined || percentageCorrectGt !== undefined) {
    const correct = reviewStatistic?.data.percentage_correct;
    if (correct === undefined) return;

    if (percentageCorrectLt !== undefined && correct > percentageCorrectLt)
      return;
    if (percentageCorrectGt !== undefined && correct < percentageCorrectGt)
      return;
  }

  // Next review less than/more than n hours ago
  if (nextReviewLt !== undefined || nextReviewGt !== undefined) {
    const availableAt = assignment?.data.available_at;
    if (!availableAt) return;
    const available = dayjs(availableAt).startOf("hour");
    const hours = Math.max(-now.diff(available, "hours"), 0);

    if (nextReviewLt !== undefined && hours > nextReviewLt) return;
    if (nextReviewGt !== undefined && hours < nextReviewGt) return;
  }

  // TODO: Last incorrect answer

  // Burned less than/more than n days ago
  if (burnedLt !== undefined || burnedGt !== undefined) {
    const burned = assignment?.data.burned_at;
    if (!burned) return;

    const days = -now.diff(burned, "days");
    if (burnedLt !== undefined && days > burnedLt) return;
    if (burnedGt !== undefined && days < burnedGt) return;
  }

  // SRS stage filter (10 is 'Locked')
  if (srsStagesLut && !srsStagesLut[assignment?.data.srs_stage ?? 10]) return;
  // Subject type filter
  if (subjectTypesLut && !subjectTypesLut[subject.object]) return;
  // JLPT level filter (-1 is 'None')
  if (jlptLevelsLut && !jlptLevelsLut[subject.data.jisho?.jlpt ?? -1]) return;
  // Jōyō grade filter (-1 is 'None')
  if (joyoGradesLut && !joyoGradesLut[subject.data.jisho?.joyo ?? -1]) return;

  // Parts of speech filter
  if (partsOfSpeech) {
    if (subject.object !== "vocabulary") return;

    // If the query partsOfSpeech and the subject's parts_of_speech have no
    // items in common, then reject the subject
    const int = intersection(partsOfSpeech, subject.data.parts_of_speech);
    if (int.length === 0) return;
  }

  return true;
}
