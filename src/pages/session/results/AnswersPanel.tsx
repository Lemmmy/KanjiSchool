// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { CollapseProps, Divider } from "antd";
import classNames from "classnames";
import { Fragment, useMemo } from "react";

import {
  StoredAssignmentMap,
  StoredSubjectMap,
  SubjectAssignmentIdMap,
  useAssignments, useSubjectAssignmentIds,
  useSubjects
} from "@api";

import { StudyQueueButton } from "@comp/study-queue/StudyQueueButton";
import { SubjectGrid } from "@comp/subjects/lists/grid";

import { Tag } from "@comp/Tag";
import { getSrsStageBaseName, isVocabularyLike, nts, SrsStageBaseName } from "@utils";

type GroupedData = Record<SrsStageBaseName, [number[], boolean]>;
const GROUPS: SrsStageBaseName[] = ["Lesson", "Apprentice", "Guru", "Master",
  "Enlightened", "Burned", "Locked"];

function groupByStage(
  subjects: StoredSubjectMap | undefined,
  assignments: StoredAssignmentMap | undefined,
  subjectAssignmentIds: SubjectAssignmentIdMap | undefined,
  subjectIds: number[]
): GroupedData | undefined {
  if (!subjects || !assignments || !subjectAssignmentIds) return;

  const data: GroupedData = {
    "Lesson": [[], false], "Apprentice": [[], false], "Guru": [[], false],
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
    if (isVocabularyLike(subject)) {
      data[stageName][1] = true;
    }
  }

  return data;
}

export function useAnswersPanel(
  type: "correct" | "incorrect",
  subjectIds: number[]
): NonNullable<CollapseProps["items"]>[number] | null {
  const subjects = useSubjects();
  const assignments = useAssignments();
  const subjectAssignmentIds = useSubjectAssignmentIds();

  const data = useMemo(() => groupByStage(subjects, assignments, subjectAssignmentIds, subjectIds),
    [subjects, assignments, subjectAssignmentIds, subjectIds]);

  return useMemo(() => {
    if (!data || subjectIds.length === 0) return null;

    return ({
      key: type,
      showArrow: false,
      className: classNames(
        "[&>.ant-collapse-header]:items-center [&:first-child>.ant-collapse-header]:rounded-t",
        {
          "[&>.ant-collapse-header]:bg-green-9 [&>.ant-collapse-header:hover]:bg-green-8":
            type === "correct",
          "[.light_&>.ant-collapse-header]:bg-green-5 [.light_&>.ant-collapse-header:hover]:bg-green-4":
            type === "correct",

          "[&>.ant-collapse-header]:bg-red-9 [&>.ant-collapse-header:hover]:bg-red-8":
            type === "incorrect",
          "[.light_&>.ant-collapse-header]:bg-red-5 [.light_&>.ant-collapse-header:hover]:bg-red-4":
            type === "incorrect",
          "[.light_&>.ant-collapse-header]:text-white":
            type === "incorrect",
          "[&.ant-collapse-item-active>.ant-collapse-header]:!rounded-b-none":
            type === "incorrect",
        }
      ),

      label: <>
        {/* Icon */}
        {type === "correct" ?
          <CheckCircleOutlined className="mr-sm ml-[4px] text-green light:text-green-8" /> :
          <CloseCircleOutlined className="mr-sm ml-[4px] text-red light:text-red-1" />}

        {/* N answered (in)correctly */}
        <span><b>{nts(subjectIds.length)}</b> answered {type}ly</span>
      </>,

      // Add to self-study queue button
      extra: <StudyQueueButton
        type="primary"
        size="small"
        subjectIds={subjectIds}
      />,

      // Create a section for each SRS stage group, in order
      children: GROUPS.map(g => {
        // Skip empty groups
        const [ids, hasVocabulary] = data[g];
        if (ids.length === 0) return null;

        return <Fragment key={g}>
          <Divider orientation="left" className="mt-sm mb-xss before:!w-[32px] before:shrink-0 after:w-full first:mt-0">
            {/* Count */}
            <Tag className="relative -top-[1px] mr-sm text-sm font-normal">
              {nts(ids.length)}
            </Tag>
            {g}
          </Divider>

          <SubjectGrid
            colorBy="type"
            size="tiny"
            subjectIds={ids}
            hasVocabulary={hasVocabulary}
            alignLeft
          />
        </Fragment>;
      })
    });
  }, [data, subjectIds, type]);
}
