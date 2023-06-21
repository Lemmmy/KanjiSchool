// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Fragment, useMemo } from "react";
import { Collapse, Divider, Tag } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";

import {
  useAssignments, useSubjectAssignmentIds,
  StoredAssignmentMap, SubjectAssignmentIdMap, StoredSubjectMap, useSubjects
} from "@api";

import { SubjectGrid } from "@comp/subjects/lists/grid";
import { StudyQueueButton } from "@comp/study-queue/StudyQueueButton";

import { getSrsStageBaseName, SrsStageBaseName, nts } from "@utils";

type GroupedData = Record<SrsStageBaseName, [number[], boolean]>;
const GROUPS: SrsStageBaseName[] = ["Initiate", "Apprentice", "Guru", "Master",
  "Enlightened", "Burned", "Locked"];

function groupByStage(
  subjects: StoredSubjectMap | undefined,
  assignments: StoredAssignmentMap | undefined,
  subjectAssignmentIds: SubjectAssignmentIdMap | undefined,
  subjectIds: number[]
): GroupedData | undefined {
  if (!subjects || !assignments || !subjectAssignmentIds) return;

  const data: GroupedData = {
    "Initiate": [[], false], "Apprentice": [[], false], "Guru": [[], false],
    "Master": [[], false], "Enlightened": [[], false], "Burned": [[], false],
    "Locked": [[], false],
  };

  for (const subjectId of subjectIds) {
    const subject = subjects[subjectId];
    if (!subject || subject.data.hidden_at) continue;

    // It's okay for assignment to be undefined, it will just get an SRS stage
    // of '10' (Locked)
    const assignment = assignments[subjectAssignmentIds[subjectId]];
    const srsStage = assignment?.data.srs_stage || 10;
    const stageName = getSrsStageBaseName(srsStage);

    data[stageName][0].push(subjectId);

    // If this subject is a vocabulary, make sure the data is marked as
    // 'hasVocabulary' - this ensures the list will render vocabulary items
    // correctly.
    if (subject.object === "vocabulary")
      data[stageName][1] = true;
  }

  return data;
}

export function useAnswersPanel(
  type: "correct" | "incorrect",
  subjectIds: number[]
): JSX.Element | null {
  const subjects = useSubjects();
  const assignments = useAssignments();
  const subjectAssignmentIds = useSubjectAssignmentIds();

  const data = useMemo(() => groupByStage(subjects, assignments, subjectAssignmentIds, subjectIds),
    [subjects, assignments, subjectAssignmentIds, subjectIds]);

  if (!data || subjectIds.length === 0) return null;

  const classes = classNames("results-answer-panel", type);

  return <Collapse.Panel
    className={classes}
    key={type}

    // Header
    header={<>
      {/* Icon */}
      {type === "correct" ? <CheckCircleOutlined /> : <CloseCircleOutlined />}

      {/* N answered (in)correctly */}
      <span><b>{nts(subjectIds.length)}</b> answered {type}ly</span>
    </>}

    // Add to self-study queue button
    extra={<StudyQueueButton
      type="primary"
      size="small"
      subjectIds={subjectIds}
    />}

    showArrow={false}
  >
    {/* Create a section for each SRS stage group, in order */}
    {GROUPS.map(g => {
      // Skip empty groups
      const [ids, hasVocabulary] = data[g];
      if (ids.length === 0) return null;

      return <Fragment key={g}>
        <Divider orientation="left">
          {/* Count */}
          <Tag className="count-tag">{nts(ids.length)}</Tag>
          {g}
        </Divider>

        <SubjectGrid
          className="color-by-type"
          size="tiny"
          subjectIds={ids}
          hasVocabulary={hasVocabulary}
        />
      </Fragment>;
    })}
  </Collapse.Panel>;
}
