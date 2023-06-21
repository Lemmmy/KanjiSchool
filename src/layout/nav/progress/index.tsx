// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { GenericSyncingProgress } from "./GenericSyncingProgress";
import { SyncImagesProgress } from "./SyncImagesProgress";
import { SyncAudioProgress } from "./SyncAudioProgress";
import { AssignmentQueueProgress } from "./AssignmentQueueProgress";

export function SyncProgressBars(): JSX.Element {
  return <div className="site-header-progresses">
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
  </div>;
}
