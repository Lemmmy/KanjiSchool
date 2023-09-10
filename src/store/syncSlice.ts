// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import {
  SyncProgress, StoredSubjectMap, StoredAssignmentMap, NextReviewsAvailable,
  ReviewForecast, AssignmentSubjectId, SubjectAssignmentIdMap,
  ApiReviewStatisticMap, ApiLevelProgressionMap, ApiStudyMaterialMap,
  PartsOfSpeechCache, SlugCache, SubjectReviewStatisticIdMap, StoredImageMap, SubjectStudyMaterialIdMap,
  OverleveledAssignments, StoredAssignment, ApiReviewStatistic, ApiLevelProgression, ApiStudyMaterial
} from "@api";

import { StreakData } from "@pages/dashboard/summary/calculateStreak.ts";

import { lsGetBoolean, lsGetNumber, lsGetObject, lsGetString } from "@utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SyncSliceState {
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
  readonly overleveledAssignments: OverleveledAssignments | null;

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

export function getInitialSyncState(): SyncSliceState {
  return {
    subjectsLastSynced: lsGetString("subjectsLastSynced"),
    subjectsSyncedThisSession: false,
    syncingSubjects: false,
    subjects: undefined,

    assignmentsLastSynced: lsGetString("assignmentsLastSynced"),
    syncingAssignments: false,
    assignments: undefined,
    subjectAssignmentIdMap: {},
    overleveledAssignments: null,

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

interface InitSubjectsPayload {
  subjectMap: StoredSubjectMap;
  partsOfSpeechCache: PartsOfSpeechCache;
  slugCache: SlugCache;
}

const syncSlice = createSlice({
  name: "sync",
  initialState: getInitialSyncState,
  reducers: {
    // ---------------------------------------------------------------------------
    // Subjects
    // ---------------------------------------------------------------------------
    setSubjectsLastSynced(s, { payload }: PayloadAction<string>) {
      s.subjectsLastSynced = payload;
    },
    setSyncingSubjects(s, { payload }: PayloadAction<boolean>) {
      s.syncingSubjects = payload;
    },
    setSyncingSubjectsProgress(s, { payload }: PayloadAction<SyncProgress>) {
      s.subjectsProgress = payload;
    },
    setSubjectsSyncedThisSession(s) {
      s.subjectsSyncedThisSession = true;
    },
    initSubjects(s, { payload }: PayloadAction<InitSubjectsPayload>) {
      const { subjectMap, partsOfSpeechCache, slugCache } = payload;
      s.subjects = subjectMap;
      s.partsOfSpeechCache = partsOfSpeechCache;
      s.slugCache = slugCache;
    },

    // ---------------------------------------------------------------------------
    // Assignments
    // ---------------------------------------------------------------------------
    setAssignmentsLastSynced(s, { payload }: PayloadAction<string>) {
      s.assignmentsLastSynced = payload;
    },
    setSyncingAssignments(s, { payload }: PayloadAction<boolean>) {
      s.syncingAssignments = payload;
    },
    setSyncingAssignmentsProgress(s, { payload }: PayloadAction<SyncProgress>) {
      s.assignmentsProgress = payload;
    },

    // Initialise assignment map from database. Also sets up the subject ID to assignment ID map.
    initAssignments(s, { payload }: PayloadAction<StoredAssignmentMap>) {
      const subjectAssignmentIdMap: SubjectAssignmentIdMap = {};
      for (const assignmentId in payload) {
        const assignment = payload[assignmentId];
        subjectAssignmentIdMap[assignment.data.subject_id] = assignment.id;
      }

      s.assignments = payload;
      s.subjectAssignmentIdMap = subjectAssignmentIdMap;
    },

    // Update an individual assignment. Also updates the subject ID to assignment map.
    updateAssignment(s, { payload }: PayloadAction<StoredAssignment>) {
      const { id, data } = payload;
      s.assignments![id] = payload;
      s.subjectAssignmentIdMap[data.subject_id] = id;
    },

    // Set overleveled lessons and reviews. This is used to show a warning to the user if they have lessons or reviews
    // that are overleveled.
    setOverleveledAssignments(s, { payload }: PayloadAction<OverleveledAssignments | null>) {
      s.overleveledAssignments = payload;
    },

    // ---------------------------------------------------------------------------
    // Review statistics
    // ---------------------------------------------------------------------------
    setReviewStatisticsLastSynced(s, { payload }: PayloadAction<string>) {
      s.reviewStatisticsLastSynced = payload;
    },
    setSyncingReviewStatistics(s, { payload }: PayloadAction<boolean>) {
      s.syncingReviewStatistics = payload;
    },
    setSyncingReviewStatisticsProgress(s, { payload }: PayloadAction<SyncProgress>) {
      s.reviewStatisticsProgress = payload;
    },

    // Initialise review statistic map from database. Also sets up the subject ID to review statistic ID map.
    initReviewStatistics(s, { payload }: PayloadAction<ApiReviewStatisticMap>) {
      const subjectReviewStatisticIdMap: SubjectReviewStatisticIdMap = {};
      for (const reviewStatisticId in payload) {
        const reviewStatistic = payload[reviewStatisticId];
        subjectReviewStatisticIdMap[reviewStatistic.data.subject_id] = reviewStatistic.id;
      }

      s.reviewStatistics = payload;
      s.subjectReviewStatisticIdMap = subjectReviewStatisticIdMap;
    },

    // Update an individual review statistic. Also updates the subject ID to review statistic ID map.
    updateReviewStatistic(s, { payload }: PayloadAction<ApiReviewStatistic>) {
      const { id, data } = payload;
      s.reviewStatistics![id] = payload;
      s.subjectReviewStatisticIdMap[data.subject_id] = id;
    },

    // ---------------------------------------------------------------------------
    // Reviews
    // ---------------------------------------------------------------------------
    setReviewsLastSynced(s, { payload }: PayloadAction<string>) {
      s.reviewsLastSynced = payload;
    },
    setSyncingReviews(s, { payload }: PayloadAction<boolean>) {
      s.syncingReviews = payload;
    },
    setSyncingReviewsProgress(s, { payload }: PayloadAction<SyncProgress>) {
      s.reviewsProgress = payload;
    },
    setStreak(s, { payload }: PayloadAction<StreakData>) {
      s.streak = payload;
    },

    // ---------------------------------------------------------------------------
    // Level progressions
    // ---------------------------------------------------------------------------
    setLevelProgressionsLastSynced(s, { payload }: PayloadAction<string>) {
      s.levelProgressionsLastSynced = payload;
    },
    setSyncingLevelProgressions(s, { payload }: PayloadAction<boolean>) {
      s.syncingLevelProgressions = payload;
    },
    setSyncingLevelProgressionsProgress(s, { payload }: PayloadAction<SyncProgress>) {
      s.levelProgressionsProgress = payload;
    },
    initLevelProgressions(s, { payload }: PayloadAction<ApiLevelProgressionMap>) {
      s.levelProgressions = payload;
    },
    updateLevelProgression(s, { payload }: PayloadAction<ApiLevelProgression>) {
      const { id } = payload;
      s.levelProgressions![id] = payload;
    },

    // ---------------------------------------------------------------------------
    // Study materials
    // ---------------------------------------------------------------------------
    setStudyMaterialsLastSynced(s, { payload }: PayloadAction<string>) {
      s.studyMaterialsLastSynced = payload;
    },
    setSyncingStudyMaterials(s, { payload }: PayloadAction<boolean>) {
      s.syncingStudyMaterials = payload;
    },
    setSyncingStudyMaterialsProgress(s, { payload }: PayloadAction<SyncProgress>) {
      s.studyMaterialsProgress = payload;
    },

    // Initialise study materials map from database. Also sets up the subject ID to study material ID map.
    initStudyMaterials(s, { payload }: PayloadAction<ApiStudyMaterialMap>) {
      const subjectStudyMaterialIdMap: SubjectStudyMaterialIdMap = {};
      for (const studyMaterialId in payload) {
        const studyMaterial = payload[studyMaterialId];
        subjectStudyMaterialIdMap[studyMaterial.data.subject_id] = studyMaterial.id;
      }

      s.studyMaterials = payload;
      s.subjectStudyMaterialIdMap = subjectStudyMaterialIdMap;
    },

    // Update an individual study material. Also updates the subject ID to study material ID map.
    updateStudyMaterial(s, { payload }: PayloadAction<ApiStudyMaterial>) {
      const { id, data } = payload;
      s.studyMaterials![id] = payload;
      s.subjectStudyMaterialIdMap[data.subject_id] = id;
    },

    // ---------------------------------------------------------------------------
    // Review forecast
    // ---------------------------------------------------------------------------
    setPendingLessons(s, { payload }: PayloadAction<AssignmentSubjectId[]>) {
      s.pendingLessons = payload;
    },
    setPendingReviews(s, { payload }: PayloadAction<AssignmentSubjectId[]>) {
      s.pendingReviews = payload;
    },
    setNextReviewsAvailable(s, { payload }: PayloadAction<NextReviewsAvailable>) {
      s.nextReviewsAvailable = payload;
    },
    setReviewForecast(s, { payload }: PayloadAction<ReviewForecast>) {
      s.reviewForecast = payload;
    },

    // ---------------------------------------------------------------------------
    // Images
    // ---------------------------------------------------------------------------
    setImagesSynced(s, { payload }: PayloadAction<boolean>) {
      s.imagesSynced = payload;
    },
    setSyncingImages(s, { payload }: PayloadAction<boolean>) {
      s.syncingImages = payload;
    },
    setSyncingImagesProgress(s, { payload }: PayloadAction<SyncProgress>) {
      s.imagesProgress = payload;
    },
    initImages(s, { payload }: PayloadAction<StoredImageMap>) {
      s.images = payload;
    },

    // ---------------------------------------------------------------------------
    // Audio
    // ---------------------------------------------------------------------------
    setSyncingAudio(s, { payload }: PayloadAction<boolean>) {
      s.syncingAudio = payload;
    },
    setSyncingAudioProgress(s, { payload }: PayloadAction<SyncProgress>) {
      s.audioProgress = payload;
    },
    incrSyncingAudioProgress(s) {
      const newCount = (s.audioProgress?.count ?? 0) + 1;
      const newTotal = s.audioProgress?.total ?? 0;

      // If the count === total, we're probably finished
      if (newCount === newTotal) {
        s.syncingAudio = false;
        s.audioProgress = { count: 0, total: 0 };
      } else {
        s.syncingAudio = true;

        if (!s.audioProgress) {
          s.audioProgress = { count: 0, total: 0 };
        }

        s.audioProgress.count = newCount;
        s.audioProgress.total = newTotal;
      }
    },
    incrSyncingAudioQueue(s, { payload }: PayloadAction<number>) {
      if (!s.audioProgress) {
        s.audioProgress = { count: 0, total: payload };
      } else {
        s.audioProgress.total += payload;
      }
    },

    // ---------------------------------------------------------------------------
    // Assignment queue
    // ---------------------------------------------------------------------------
    setProcessingQueue(s, { payload }: PayloadAction<boolean>) {
      s.processingQueue = payload;
    },
    setQueueProgress(s, { payload }: PayloadAction<SyncProgress>) {
      s.queueProgress = payload;
    },
    setQueueConnectionError(s, { payload }: PayloadAction<boolean>) {
      s.queueConnectionError = payload;
    },
    incrQueueNonce(s) {
      s.queueNonce++;
    }
  }
});

export const {
  setSubjectsLastSynced, setSyncingSubjects, setSyncingSubjectsProgress, setSubjectsSyncedThisSession, initSubjects,
  setAssignmentsLastSynced, setSyncingAssignments, setSyncingAssignmentsProgress, initAssignments, updateAssignment,
  setOverleveledAssignments,
  setReviewStatisticsLastSynced, setSyncingReviewStatistics, setSyncingReviewStatisticsProgress, initReviewStatistics,
  updateReviewStatistic,
  setReviewsLastSynced, setSyncingReviews, setSyncingReviewsProgress, setStreak,
  setLevelProgressionsLastSynced, setSyncingLevelProgressions, setSyncingLevelProgressionsProgress,
  initLevelProgressions, updateLevelProgression,
  setStudyMaterialsLastSynced, setSyncingStudyMaterials, setSyncingStudyMaterialsProgress, initStudyMaterials,
  updateStudyMaterial,
  setPendingLessons, setPendingReviews, setNextReviewsAvailable, setReviewForecast,
  setImagesSynced, setSyncingImages, setSyncingImagesProgress, initImages,
  setSyncingAudio, setSyncingAudioProgress, incrSyncingAudioProgress, incrSyncingAudioQueue,
  setProcessingQueue, setQueueProgress, setQueueConnectionError, incrQueueNonce
} = syncSlice.actions;

export default syncSlice.reducer;
