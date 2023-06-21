// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode, useMemo } from "react";
import classNames from "classnames";

import { StoredAssignment, StoredSubject } from "@api";

import { SubjectTooltipSubjectData } from "./SubjectData";
import { SubjectTooltipAssignmentData } from "./AssignmentData";
import { SubjectTooltipExtraData } from "./ExtraData";

import { StudyQueueButton } from "@comp/study-queue/StudyQueueButton";
import { normalizeVocabType } from "@utils";

export type SubjectRenderTooltipFn =
  (subject: StoredSubject, assignment?: StoredAssignment) => ReactNode;

interface Props {
  subject: StoredSubject;
  assignment?: StoredAssignment;

  showJlpt?: boolean;
  showJoyo?: boolean;
  showFreq?: boolean;

  hideStudyQueueButton?: boolean;
}

function SubjectTooltipInner({
  subject,
  assignment,
  showJlpt,
  showJoyo,
  showFreq,
  hideStudyQueueButton
}: Props): JSX.Element {
  const locked = !assignment?.data.unlocked_at;

  const classes = classNames(
    "subject-tooltip-inner",
    "type-" + normalizeVocabType(subject.object),
    { locked }
  );

  return <div className={classes}>
    {/* Subject data - characters, level, meaning and readings */}
    <SubjectTooltipSubjectData subject={subject} />

    <div className="sep" />

    {/* Assignment data - SRS stage, next review */}
    <SubjectTooltipAssignmentData assignment={assignment} />

    {/* Jlpt, joyo, freq */}
    {(showJlpt || showJoyo || showFreq) && <SubjectTooltipExtraData
      subject={subject}
      showJlpt={showJlpt} showJoyo={showJoyo} showFreq={showFreq}
    />}

    {/* Self-study queue button */}
    {!hideStudyQueueButton && <div className="self-study-row">
      <StudyQueueButton
        type="primary"
        subjectId={subject.id}
        useShortTitle
      />
    </div>}
  </div>;
}

export const makeRenderTooltipFn = (
  showJlpt?: boolean,
  showJoyo?: boolean,
  showFreq?: boolean
): SubjectRenderTooltipFn =>
  (subject: StoredSubject, assignment?: StoredAssignment): ReactNode => (
    <SubjectTooltipInner
      subject={subject} assignment={assignment}
      showJlpt={showJlpt} showJoyo={showJoyo} showFreq={showFreq}
    />
  );

export const useDefaultRenderTooltipFn =
  (fn?: SubjectRenderTooltipFn): SubjectRenderTooltipFn =>
    useMemo(() => fn || makeRenderTooltipFn(), [fn]);
