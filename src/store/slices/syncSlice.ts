// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SyncProgress } from "@api";

import { lsGetString } from "@utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SyncSliceState {
  readonly subjectsLastSynced?: string;
  readonly subjectsSyncedThisSession?: boolean;
  readonly syncingSubjects: boolean;
  readonly subjectsProgress?: SyncProgress;

  readonly assignmentsLastSynced?: string;
  readonly syncingAssignments: boolean;
  readonly assignmentsProgress?: SyncProgress;

  readonly reviewStatisticsLastSynced?: string;
  readonly syncingReviewStatistics: boolean;
  readonly reviewStatisticsProgress?: SyncProgress;

  readonly reviewsLastSynced?: string;
  readonly syncingReviews: boolean;
  readonly reviewsProgress?: SyncProgress;

  readonly levelProgressionsLastSynced?: string;
  readonly levelProgressionsProgress?: SyncProgress;
  readonly syncingLevelProgressions: boolean;

  readonly studyMaterialsLastSynced?: string;
  readonly studyMaterialsProgress?: SyncProgress;
  readonly syncingStudyMaterials: boolean;

  readonly imagesSynced: boolean;
  readonly syncingImages: boolean;
  readonly imagesProgress?: SyncProgress;

  readonly syncingAudio: boolean;
  readonly audioProgress?: SyncProgress;

  readonly processingQueue: boolean;
  readonly queueProgress?: SyncProgress;
  readonly queueConnectionError: boolean;
  readonly queueNonce: number;

  readonly apiRateLimitResetTime?: number;
}

export const initialState = (): SyncSliceState => ({
  subjectsLastSynced: lsGetString("subjectsLastSynced"),
  subjectsSyncedThisSession: false,
  syncingSubjects: false,
  subjectsProgress: undefined,

  assignmentsLastSynced: lsGetString("assignmentsLastSynced"),
  syncingAssignments: false,

  reviewStatisticsLastSynced: lsGetString("reviewStatisticsLastSynced"),
  syncingReviewStatistics: false,

  reviewsLastSynced: lsGetString("reviewsLastSynced"),
  syncingReviews: false,

  studyMaterialsLastSynced: lsGetString("studyMaterialsLastSynced"),
  syncingStudyMaterials: false,

  levelProgressionsLastSynced: lsGetString("levelProgressionsLastSynced"),
  syncingLevelProgressions: false,

  imagesSynced: false,
  syncingImages: false,

  syncingAudio: false,

  processingQueue: false,
  queueConnectionError: false,
  queueNonce: 0,

  apiRateLimitResetTime: undefined
});

const syncSlice = createSlice({
  name: "sync",
  initialState,
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

    // ---------------------------------------------------------------------------
    // Review statistics
    // ---------------------------------------------------------------------------
    setReviewStatisticsLastSynced(s, { payload }: PayloadAction<string>) {
      s.reviewStatisticsLastSynced = payload;
    },
    setSyncingReviewStatistics(s, { payload }: PayloadAction<boolean>) {
      s.syncingReviewStatistics = payload;
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

    // ---------------------------------------------------------------------------
    // Level progressions
    // ---------------------------------------------------------------------------
    setLevelProgressionsLastSynced(s, { payload }: PayloadAction<string>) {
      s.levelProgressionsLastSynced = payload;
    },
    setSyncingLevelProgressions(s, { payload }: PayloadAction<boolean>) {
      s.syncingLevelProgressions = payload;
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

    // ---------------------------------------------------------------------------
    // Audio
    // ---------------------------------------------------------------------------
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
    },

    // ---------------------------------------------------------------------------
    // API rate limit
    // ---------------------------------------------------------------------------
    setApiRateLimitResetTime(s, { payload }: PayloadAction<number | undefined>) {
      s.apiRateLimitResetTime = payload;
    }
  }
});

export const {
  setSubjectsLastSynced,
  setSyncingSubjects,
  setSyncingSubjectsProgress,
  setSubjectsSyncedThisSession,

  setAssignmentsLastSynced,
  setSyncingAssignments,
  setSyncingAssignmentsProgress,

  setReviewStatisticsLastSynced,
  setSyncingReviewStatistics,

  setReviewsLastSynced,
  setSyncingReviews,
  setSyncingReviewsProgress,

  setLevelProgressionsLastSynced,
  setSyncingLevelProgressions,

  setStudyMaterialsLastSynced,
  setSyncingStudyMaterials,

  setImagesSynced,
  setSyncingImages,
  setSyncingImagesProgress,

  incrSyncingAudioProgress,
  incrSyncingAudioQueue,

  setProcessingQueue,
  setQueueProgress,
  setQueueConnectionError,
  incrQueueNonce,

  setApiRateLimitResetTime
} = syncSlice.actions;

export default syncSlice.reducer;
