// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { createAction } from "typesafe-actions";

import * as constants from "../constants";

import {
  SyncProgress,
  StoredSubjectMap, PartsOfSpeechCache, SlugCache,
  StoredAssignmentMap, StoredAssignment,
  NextReviewsAvailable, ReviewForecast, AssignmentSubjectId,
  ApiReviewStatistic, ApiReviewStatisticMap,
  ApiLevelProgressionMap, ApiLevelProgression,
  ApiStudyMaterialMap, ApiStudyMaterial,
  StoredImageMap,
  OverleveledAssignments
} from "@api";

import { StreakData } from "@pages/dashboard/summary/calculateStreak";

export const setSubjectsLastSynced = createAction(constants.SET_SUBJECTS_LAST_SYNCED)<string>();
export const setSyncingSubjects = createAction(constants.SET_SYNCING_SUBJECTS)<boolean>();
export const setSyncingSubjectsProgress = createAction(constants.SET_SYNCING_SUBJECTS_PROGRESS)<SyncProgress>();
export const setSubjectsSyncedThisSession = createAction(constants.SET_SUBJECTS_SYNCED_THIS_SESSION)();
export interface InitSubjectsPayload {
  subjectMap: StoredSubjectMap;
  partsOfSpeechCache: PartsOfSpeechCache;
  slugCache: SlugCache;
}
export const initSubjects = createAction(constants.INIT_SUBJECTS)<InitSubjectsPayload>();

export const setAssignmentsLastSynced = createAction(constants.SET_ASSIGNMENTS_LAST_SYNCED)<string>();
export const setSyncingAssignments = createAction(constants.SET_SYNCING_ASSIGNMENTS)<boolean>();
export const setSyncingAssignmentsProgress = createAction(constants.SET_SYNCING_ASSIGNMENTS_PROGRESS)<SyncProgress>();
export const initAssignments = createAction(constants.INIT_ASSIGNMENTS)<StoredAssignmentMap>();
export const updateAssignment = createAction(constants.UPDATE_ASSIGNMENT)<StoredAssignment>();
export const setOverleveledAssignments = createAction(constants.SET_OVERLEVELED_ASSIGNMENTS)<OverleveledAssignments | undefined>();

export const setReviewStatisticsLastSynced = createAction(constants.SET_REVIEW_STATISTICS_LAST_SYNCED)<string>();
export const setSyncingReviewStatistics = createAction(constants.SET_SYNCING_REVIEW_STATISTICS)<boolean>();
export const setSyncingReviewStatisticsProgress = createAction(constants.SET_SYNCING_REVIEW_STATISTICS_PROGRESS)<SyncProgress>();
export const initReviewStatistics = createAction(constants.INIT_REVIEW_STATISTICS)<ApiReviewStatisticMap>();
export const updateReviewStatistic = createAction(constants.UPDATE_REVIEW_STATISTIC)<ApiReviewStatistic>();

export const setReviewsLastSynced = createAction(constants.SET_REVIEWS_LAST_SYNCED)<string>();
export const setSyncingReviews = createAction(constants.SET_SYNCING_REVIEWS)<boolean>();
export const setSyncingReviewsProgress = createAction(constants.SET_SYNCING_REVIEWS_PROGRESS)<SyncProgress>();
export const setStreak = createAction(constants.SET_STREAK)<StreakData>();

export const setLevelProgressionsLastSynced = createAction(constants.SET_LEVEL_PROGRESSIONS_LAST_SYNCED)<string>();
export const setSyncingLevelProgressions = createAction(constants.SET_SYNCING_LEVEL_PROGRESSIONS)<boolean>();
export const setSyncingLevelProgressionsProgress = createAction(constants.SET_SYNCING_LEVEL_PROGRESSIONS_PROGRESS)<SyncProgress>();
export const initLevelProgressions = createAction(constants.INIT_LEVEL_PROGRESSIONS)<ApiLevelProgressionMap>();
export const updateLevelProgression = createAction(constants.UPDATE_LEVEL_PROGRESSION)<ApiLevelProgression>();

export const setStudyMaterialsLastSynced = createAction(constants.SET_STUDY_MATERIALS_LAST_SYNCED)<string>();
export const setSyncingStudyMaterials = createAction(constants.SET_SYNCING_STUDY_MATERIALS)<boolean>();
export const setSyncingStudyMaterialsProgress = createAction(constants.SET_SYNCING_STUDY_MATERIALS_PROGRESS)<SyncProgress>();
export const initStudyMaterials = createAction(constants.INIT_STUDY_MATERIALS)<ApiStudyMaterialMap>();
export const updateStudyMaterial = createAction(constants.UPDATE_STUDY_MATERIAL)<ApiStudyMaterial>();

export const setPendingLessons = createAction(constants.SET_PENDING_LESSONS)<AssignmentSubjectId[]>();
export const setPendingReviews = createAction(constants.SET_PENDING_REVIEWS)<AssignmentSubjectId[]>();
export const setNextReviewsAvailable = createAction(constants.SET_NEXT_REVIEWS_AVAILABLE)<NextReviewsAvailable>();
export const setReviewForecast = createAction(constants.SET_REVIEW_FORECAST)<ReviewForecast>();

export const imagesSynced = createAction(constants.IMAGES_SYNCED)();
export const setSyncingImages = createAction(constants.SET_SYNCING_IMAGES)<boolean>();
export const setSyncingImagesProgress = createAction(constants.SET_SYNCING_IMAGES_PROGRESS)<SyncProgress>();
export const initImages = createAction(constants.INIT_IMAGES)<StoredImageMap>();

export const setSyncingAudio = createAction(constants.SET_SYNCING_AUDIO)<boolean>();
export const setSyncingAudioProgress = createAction(constants.SET_SYNCING_AUDIO_PROGRESS)<SyncProgress>();
export const incrSyncingAudioProgress = createAction(constants.INCR_SYNCING_AUDIO_PROGRESS)();
export const incrSyncingAudioQueue = createAction(constants.INCR_SYNCING_AUDIO_QUEUE)<number>();

export const setProcessingQueue = createAction(constants.SET_PROCESSING_QUEUE)<boolean>();
export const setQueueProgress = createAction(constants.SET_QUEUE_PROGRESS)<SyncProgress>();
export const setQueueConnectionError = createAction(constants.SET_QUEUE_CONNECTION_ERROR)<boolean>();
export const incrQueueNonce = createAction(constants.INCR_QUEUE_NONCE)();
