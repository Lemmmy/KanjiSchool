// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import * as actions from "@actions/SyncActions";
import { createReducer } from "typesafe-actions";

import {
  SyncProgress, StoredSubjectMap, StoredAssignmentMap, NextReviewsAvailable,
  ReviewForecast, AssignmentSubjectId, SubjectAssignmentIdMap,
  ApiReviewStatisticMap, ApiLevelProgressionMap, ApiStudyMaterialMap,
  PartsOfSpeechCache, SlugCache, SubjectReviewStatisticIdMap, StoredImageMap, SubjectStudyMaterialIdMap
} from "@api";

import { StreakData } from "@pages/dashboard/summary/calculateStreak";

import { lsGetString, lsGetNumber, lsGetBoolean, lsGetObject } from "@utils";

export interface State {
  readonly subjectsLastSynced?: string;
  readonly subjectsSyncedThisSession?: boolean;
  readonly syncingSubjects: boolean;
  readonly subjectsProgress?: SyncProgress;
  readonly subjects?: StoredSubjectMap;
  readonly partsOfSpeechCache?: PartsOfSpeechCache;
  readonly slugCache?: SlugCache;

  readonly assignmentsLastSynced?: string;
  readonly syncingAssignments: boolean;
  readonly assignmentsProgress?: SyncProgress;
  readonly assignments?: StoredAssignmentMap;
  readonly subjectAssignmentIdMap: SubjectAssignmentIdMap;

  readonly reviewStatisticsLastSynced?: string;
  readonly syncingReviewStatistics: boolean;
  readonly reviewStatisticsProgress?: SyncProgress;
  readonly reviewStatistics?: ApiReviewStatisticMap;
  readonly subjectReviewStatisticIdMap: SubjectReviewStatisticIdMap;

  readonly reviewsLastSynced?: string;
  readonly syncingReviews: boolean;
  readonly reviewsProgress?: SyncProgress;
  readonly streak: StreakData;

  readonly levelProgressionsLastSynced?: string;
  readonly levelProgressionsProgress?: SyncProgress;
  readonly syncingLevelProgressions: boolean;
  readonly levelProgressions?: ApiLevelProgressionMap;

  readonly studyMaterialsLastSynced?: string;
  readonly studyMaterialsProgress?: SyncProgress;
  readonly syncingStudyMaterials: boolean;
  readonly studyMaterials: ApiStudyMaterialMap;
  readonly subjectStudyMaterialIdMap: SubjectStudyMaterialIdMap;

  readonly pendingLessons: AssignmentSubjectId[];
  readonly pendingReviews: AssignmentSubjectId[];
  readonly nextReviewsAvailable: NextReviewsAvailable;
  readonly reviewForecast?: ReviewForecast;

  readonly imagesSynced: boolean;
  readonly syncingImages: boolean;
  readonly imagesProgress?: SyncProgress;
  readonly images?: StoredImageMap;

  readonly syncingAudio: boolean;
  readonly audioProgress?: SyncProgress;

  readonly processingQueue: boolean;
  readonly queueProgress?: SyncProgress;
  readonly queueConnectionError: boolean;
  readonly queueNonce: number;
}

export function getInitialSyncState(): State {
  return {
    subjectsLastSynced: lsGetString("subjectsLastSynced"),
    subjectsSyncedThisSession: false,
    syncingSubjects: false,
    subjects: undefined,

    assignmentsLastSynced: lsGetString("assignmentsLastSynced"),
    syncingAssignments: false,
    assignments: undefined,
    subjectAssignmentIdMap: {},

    reviewStatisticsLastSynced: lsGetString("reviewStatisticsLastSynced"),
    syncingReviewStatistics: false,
    reviewStatistics: undefined,
    subjectReviewStatisticIdMap: {},

    reviewsLastSynced: lsGetString("reviewsLastSynced"),
    syncingReviews: false,
    streak: {
      currentStreak: lsGetNumber("currentStreak") ?? 0,
      maxStreak: lsGetNumber("maxStreak") ?? 0,
      todayInStreak: false // always manually calculate
    },

    studyMaterialsLastSynced: lsGetString("studyMaterialsLastSynced"),
    syncingStudyMaterials: false,
    studyMaterials: {},
    subjectStudyMaterialIdMap: {},

    levelProgressionsLastSynced: lsGetString("levelProgressionsLastSynced"),
    syncingLevelProgressions: false,
    levelProgressions: undefined,

    pendingLessons: lsGetObject<AssignmentSubjectId[]>("pendingLessons2") || [],
    pendingReviews: lsGetObject<AssignmentSubjectId[]>("pendingReviews2") || [],
    nextReviewsAvailable: {
      checkTime: lsGetString("nextReviewsCheckTime") || null,
      nextReviewsAt: lsGetString("nextReviewsAt") || null,
      nextReviewsNow: lsGetBoolean("nextReviewsNow"),
      nextReviewsCount: lsGetNumber("nextReviewsCount", 0) || 0,
      nextReviewsWeek: lsGetNumber("nextReviewsWeek", 0) || 0,
    },

    imagesSynced: false,
    syncingImages: false,

    syncingAudio: false,

    processingQueue: false,
    queueConnectionError: false,
    queueNonce: 0
  };
}

export const SyncReducer = createReducer({} as State)
  // ---------------------------------------------------------------------------
  // Subjects
  // ---------------------------------------------------------------------------
  .handleAction(actions.setSubjectsLastSynced, (state, { payload }): State =>
    ({ ...state, subjectsLastSynced: payload }))
  .handleAction(actions.setSyncingSubjects, (state, { payload }): State =>
    ({ ...state, syncingSubjects: payload }))
  .handleAction(actions.setSyncingSubjectsProgress, (state, { payload }): State =>
    ({ ...state, subjectsProgress: payload }))
  .handleAction(actions.setSubjectsSyncedThisSession, (state): State =>
    ({ ...state, subjectsSyncedThisSession: true }))
  .handleAction(actions.initSubjects, (state, { payload }): State => ({
    ...state,
    subjects: payload.subjectMap,
    partsOfSpeechCache: payload.partsOfSpeechCache,
    slugCache: payload.slugCache,
  }))
  // ---------------------------------------------------------------------------
  // Assignments
  // ---------------------------------------------------------------------------
  .handleAction(actions.setAssignmentsLastSynced, (state, { payload }): State =>
    ({ ...state, assignmentsLastSynced: payload }))
  .handleAction(actions.setSyncingAssignments, (state, { payload }): State =>
    ({ ...state, syncingAssignments: payload }))
  .handleAction(actions.setSyncingAssignmentsProgress, (state, { payload }): State =>
    ({ ...state, assignmentsProgress: payload }))
  // Initialise assignment map from database. Also sets up the subject ID to
  // assignment ID map.
  .handleAction(actions.initAssignments, (state, { payload }): State => {
    const subjectAssignmentIdMap: SubjectAssignmentIdMap = {};
    for (const assignmentId in payload) {
      const assignment = payload[assignmentId];
      subjectAssignmentIdMap[assignment.data.subject_id] = assignment.id;
    }

    return {
      ...state,
      assignments: payload,
      subjectAssignmentIdMap
    };
  })
  // Update an individual assignment. Also updates the subject ID to assignment
  // map if necessary.
  .handleAction(actions.updateAssignment, (state, { payload }): State => ({
    ...state,
    assignments: {
      ...state.assignments,
      [payload.id]: payload
    },
    subjectAssignmentIdMap: {
      ...state.subjectAssignmentIdMap,
      [payload.data.subject_id]: payload.id
    }
  }))
  // ---------------------------------------------------------------------------
  // Review statistics
  // ---------------------------------------------------------------------------
  .handleAction(actions.setReviewStatisticsLastSynced, (state, { payload }): State =>
    ({ ...state, reviewStatisticsLastSynced: payload }))
  .handleAction(actions.setSyncingReviewStatistics, (state, { payload }): State =>
    ({ ...state, syncingReviewStatistics: payload }))
  .handleAction(actions.setSyncingReviewStatisticsProgress, (state, { payload }): State =>
    ({ ...state, reviewStatisticsProgress: payload }))
  // Initialise review statistic map from database. Also sets up the subject ID
  // to review statistic ID map.
  .handleAction(actions.initReviewStatistics, (state, { payload }): State => {
    const subjectReviewStatisticIdMap: SubjectReviewStatisticIdMap = {};
    for (const reviewStatisticId in payload) {
      const reviewStatistic = payload[reviewStatisticId];
      subjectReviewStatisticIdMap[reviewStatistic.data.subject_id]
        = reviewStatistic.id;
    }

    return {
      ...state,
      reviewStatistics: payload,
      subjectReviewStatisticIdMap
    };
  })
  // Update an individual review statistic. Also updates the subject ID to
  // review statistic map if necessary.
  .handleAction(actions.updateReviewStatistic, (state, { payload }): State => ({
    ...state,
    reviewStatistics: {
      ...state.reviewStatistics,
      [payload.id]: payload
    },
    subjectReviewStatisticIdMap: {
      ...state.subjectReviewStatisticIdMap,
      [payload.data.subject_id]: payload.id
    }
  }))
  // ---------------------------------------------------------------------------
  // Reviews
  // ---------------------------------------------------------------------------
  .handleAction(actions.setReviewsLastSynced, (state, { payload }): State =>
    ({ ...state, reviewsLastSynced: payload }))
  .handleAction(actions.setSyncingReviews, (state, { payload }): State =>
    ({ ...state, syncingReviews: payload }))
  .handleAction(actions.setSyncingReviewsProgress, (state, { payload }): State =>
    ({ ...state, reviewsProgress: payload }))
  .handleAction(actions.setStreak, (state, { payload }): State =>
    ({ ...state, streak: payload }))
  // ---------------------------------------------------------------------------
  // Level progressions
  // ---------------------------------------------------------------------------
  .handleAction(actions.setLevelProgressionsLastSynced, (state, { payload }): State =>
    ({ ...state, levelProgressionsLastSynced: payload }))
  .handleAction(actions.setSyncingLevelProgressions, (state, { payload }): State =>
    ({ ...state, syncingLevelProgressions: payload }))
  .handleAction(actions.setSyncingLevelProgressionsProgress, (state, { payload }): State =>
    ({ ...state, levelProgressionsProgress: payload }))
  .handleAction(actions.initLevelProgressions, (state, { payload }): State =>
    ({ ...state, levelProgressions: payload }))
  .handleAction(actions.updateLevelProgression, (state, { payload }): State => ({
    ...state,
    levelProgressions: {
      ...state.levelProgressions,
      [payload.id]: payload
    }
  }))
  // ---------------------------------------------------------------------------
  // Study materials
  // ---------------------------------------------------------------------------
  .handleAction(actions.setStudyMaterialsLastSynced, (state, { payload }): State =>
    ({ ...state, studyMaterialsLastSynced: payload }))
  .handleAction(actions.setSyncingStudyMaterials, (state, { payload }): State =>
    ({ ...state, syncingStudyMaterials: payload }))
  .handleAction(actions.setSyncingStudyMaterialsProgress, (state, { payload }): State =>
    ({ ...state, studyMaterialsProgress: payload }))
  // Initialise study materials map from database. Also sets up the subject ID
  // to study material ID map.
  .handleAction(actions.initStudyMaterials, (state, { payload }): State => {
    const subjectStudyMaterialIdMap: SubjectStudyMaterialIdMap = {};
    for (const studyMaterialId in payload) {
      const studyMaterial = payload[studyMaterialId];
      subjectStudyMaterialIdMap[studyMaterial.data.subject_id]
        = studyMaterial.id;
    }

    return {
      ...state,
      studyMaterials: payload,
      subjectStudyMaterialIdMap
    };
  })
  // Update an individual study material. Also updates the subject ID to study
  // material ID map if necessary.
  .handleAction(actions.updateStudyMaterial, (state, { payload }): State => ({
    ...state,
    studyMaterials: {
      ...state.studyMaterials,
      [payload.id]: payload
    },
    subjectStudyMaterialIdMap: {
      ...state.subjectStudyMaterialIdMap,
      [payload.data.subject_id]: payload.id
    }
  }))
  // ---------------------------------------------------------------------------
  // Review forecast
  // ---------------------------------------------------------------------------
  .handleAction(actions.setPendingLessons, (state, { payload }): State =>
    ({ ...state, pendingLessons: payload }))
  .handleAction(actions.setPendingReviews, (state, { payload }): State =>
    ({ ...state, pendingReviews: payload }))
  .handleAction(actions.setNextReviewsAvailable, (state, { payload }): State =>
    ({ ...state, nextReviewsAvailable: payload }))
  .handleAction(actions.setReviewForecast, (state, { payload }): State =>
    ({ ...state, reviewForecast: payload }))
  // ---------------------------------------------------------------------------
  // Images
  // ---------------------------------------------------------------------------
  .handleAction(actions.imagesSynced, state => ({ ...state, imagesSynced: true }))
  .handleAction(actions.setSyncingImages, (state, { payload }): State =>
    ({ ...state, syncingImages: payload }))
  .handleAction(actions.setSyncingImagesProgress, (state, { payload }): State =>
    ({ ...state, imagesProgress: payload }))
  .handleAction(actions.initImages, (state, { payload }): State =>
    ({ ...state, images: payload }))
  // ---------------------------------------------------------------------------
  // Audio
  // ---------------------------------------------------------------------------
  .handleAction(actions.setSyncingAudio, (state, { payload }): State =>
    ({ ...state, syncingAudio: payload }))
  .handleAction(actions.setSyncingAudioProgress, (state, { payload }): State => ({
    ...state, audioProgress: payload
  }))
  .handleAction(actions.incrSyncingAudioProgress, state => {
    const newCount = (state.audioProgress?.count ?? 0) + 1;
    const newTotal = state.audioProgress?.total ?? 0;

    // If the count === total, we're probably finished
    if (newCount === newTotal) {
      return {
        ...state,
        syncingAudio: false,
        audioProgress: { count: 0, total: 0 }
      };
    } else {
      return {
        ...state,
        syncingAudio: true,
        audioProgress: { count: newCount, total: newTotal }
      };
    }
  })
  .handleAction(actions.incrSyncingAudioQueue, (state, { payload }): State => ({
    ...state,
    audioProgress: {
      count: state.audioProgress?.count || 0,
      total: (state.audioProgress?.total || 0) + payload,
    }
  }))
  // ---------------------------------------------------------------------------
  // Assignment queue
  // ---------------------------------------------------------------------------
  .handleAction(actions.setProcessingQueue, (state, { payload }): State =>
    ({ ...state, processingQueue: payload }))
  .handleAction(actions.setQueueProgress, (state, { payload }): State =>
    ({ ...state, queueProgress: payload }))
  .handleAction(actions.setQueueConnectionError, (state, { payload }): State =>
    ({ ...state, queueConnectionError: payload }))
  .handleAction(actions.incrQueueNonce, state =>
    ({ ...state, queueNonce: state.queueNonce + 1 }));
