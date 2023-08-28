// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { StoredAssignment, StoredSubject } from "@api";
import { SubjectTooltipSubjectData } from "./SubjectData.tsx";
import { SubjectTooltipAssignmentData } from "./AssignmentData.tsx";
import { SubjectTooltipExtraData } from "./ExtraData.tsx";
import { StudyQueueButton } from "@comp/study-queue/StudyQueueButton.tsx";

interface Props {
  subject: StoredSubject;
  assignment?: StoredAssignment;

  showJlpt?: boolean;
  showJoyo?: boolean;
  showFreq?: boolean;

  hideStudyQueueButton?: boolean;
}

export function SubjectTooltipInner({
  subject,
  assignment,
  showJlpt,
  showJoyo,
  showFreq,
  hideStudyQueueButton
}: Props): JSX.Element {
  return <div className="min-w-[200px] p-xs">
    {/* Subject data - characters, level, meaning and readings */}
    <SubjectTooltipSubjectData subject={subject}/>

    {/* Separator */}
    <div className="w-full mt-[6px] mb-[4px] border-0 border-solid border-b border-b-white/15"/>

    {/* Assignment data - SRS stage, next review */}
    <SubjectTooltipAssignmentData assignment={assignment}/>

    {/* Jlpt, joyo, freq */}
    {(showJlpt || showJoyo || showFreq) && <SubjectTooltipExtraData
      subject={subject}
      showJlpt={showJlpt} showJoyo={showJoyo} showFreq={showFreq}
    />}

    {/* Self-study queue button */}
    {!hideStudyQueueButton && <div className="flex justify-center mt-sm">
      <StudyQueueButton
        type="primary"
        subjectId={subject.id}
        useShortTitle
      />
    </div>}
  </div>;
}
