// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RateLimitHit } from "./RateLimitHit.tsx";
import { GenericSyncingProgress } from "./GenericSyncingProgress";
import { SyncImagesProgress } from "./SyncImagesProgress";
import { SyncAudioProgress } from "./SyncAudioProgress";
import { AssignmentQueueProgress } from "./AssignmentQueueProgress";

export function SyncProgressBars(): JSX.Element {
  return <div className="flex max-w-[calc(100vw-720px)] overflow-hidden mr-sm relative">
    <RateLimitHit />

    <GenericSyncingProgress name="subjects"
      syncingKey="syncingSubjects" syncProgressKey="subjectsProgress" />
    <GenericSyncingProgress name="assignments"
      syncingKey="syncingAssignments" syncProgressKey="assignmentsProgress" />
    <GenericSyncingProgress name="review statistics"
      syncingKey="syncingReviewStatistics" syncProgressKey="reviewStatisticsProgress" />
    <GenericSyncingProgress name="reviews"
      syncingKey="syncingReviews" syncProgressKey="reviewsProgress" />
    <GenericSyncingProgress name="study materials"
      syncingKey="syncingStudyMaterials" syncProgressKey="studyMaterialsProgress" />
    <GenericSyncingProgress name="level progressions"
      syncingKey="syncingLevelProgressions" syncProgressKey="levelProgressionsProgress" />
    <SyncImagesProgress />
    <SyncAudioProgress />
    <AssignmentQueueProgress />

    {/* Fade out on the right (in event of overflow) */}
    <div
      className="absolute inset-y-0 right-0 w-lg bg-gradient-to-r from-transparent to-header pointer-events-none z-50"
    />
  </div>;
}
