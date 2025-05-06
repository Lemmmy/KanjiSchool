// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect } from "react";
import { Tooltip } from "antd";

import {
  useSubjects, useLevelProgressions, useAssignments, useUser,
  StoredSubjectMap, ApiLevelProgressionMap, StoredAssignmentMap, ApiUser,
  NormalizedSubjectType
} from "@api";

import { DhmDuration } from "@comp/DhmDuration";
import { SimpleCard } from "@comp/SimpleCard.tsx";

import dayjs from "dayjs";
import { normalizeVocabType, nts, useBooleanSetting } from "@utils";

interface Data {
  startDate: Date;
  startDateDaysAgo?: number;
  typicalLevelUp?: number; // TODO
  timeOnLevel?: number;
  levelUpIn?: number; // TODO
  itemsLearnedRadical: number;
  itemsLearnedKanji: number;
  itemsLearnedVocab: number;
}

function getData(
  user?: ApiUser,
  subjects?: StoredSubjectMap,
  assignments?: StoredAssignmentMap,
  levelProgressions?: ApiLevelProgressionMap
): Data | undefined {
  if (!user || !subjects || !assignments || !levelProgressions)
    return undefined;

  const now = dayjs();

  // Calculate the start date and days ago
  const startDate = new Date(user.data.started_at || new Date());
  const startDateDaysAgo = now.diff(startDate, "days");

  // Calculate the time spent on the current level
  const userLevel = user.data.level;
  const levelProgression = Object.values(levelProgressions)
    .find(p => p.data.level === userLevel);
  const timeOnLevel = levelProgression?.data?.started_at
    ? now.diff(levelProgression.data.started_at, "seconds") : undefined;

  // Calculate the items learned count
  let itemsLearnedRadical = 0, itemsLearnedKanji = 0, itemsLearnedVocab = 0;
  for (const assignmentId in assignments) {
    const assignment = assignments[assignmentId];
    if (assignment.data.hidden || assignment.data.srs_stage < 5) continue;

    const subject = subjects[assignment.data.subject_id];
    if (!subject || subject.data.hidden_at) continue;

    const type = normalizeVocabType(subject.object);
    if (type === "radical") itemsLearnedRadical++;
    else if (type === "kanji") itemsLearnedKanji++;
    else if (type === "vocabulary") itemsLearnedVocab++;
  }

  return {
    startDate, startDateDaysAgo,
    timeOnLevel,
    itemsLearnedRadical, itemsLearnedKanji, itemsLearnedVocab
  };
}

const TYPE_LABELS: Record<NormalizedSubjectType, [string, string]> = {
  radical: ["radicals", "部首"],
  kanji: ["kanji", "漢字"],
  vocabulary: ["vocabulary", "単語"],
};

/*

  .dashboard-current-status-card {
    .type {
      margin-right: @padding-xs;
      &:last-child { margin-right: 0; }

      &.radical { color: @color-radical; }
      &.kanji { color: @color-kanji; }
      &.vocab { color: @color-vocabulary; }
    }
  }

  .dashboard-current-status-card {
    td:not(:first-child) {
      text-align: left !important;
    }
  }

 */

export function CurrentStatusCard(): React.ReactElement {
  const [data, setData] = useState<Data>();

  const user = useUser();
  const subjects = useSubjects();
  const assignments = useAssignments();
  const levelProgressions = useLevelProgressions();

  const useJa = useBooleanSetting("dashboardLevelProgressJa");
  const lbl = useJa ? 1 : 0;
  const sp = useJa ? "" : <>&nbsp;</>;

  useEffect(() => setData(getData(user, subjects, assignments, levelProgressions)),
    [user, subjects, assignments, levelProgressions]);

  return <SimpleCard
    title="Current status"
    className="dashboard-current-status-card dashboard-epic-table-card"
    flush
    loading={!user || !data}
  >
    <table className="center-table">
      <tbody>
        {/* Level */}
        {user && <tr>
          <td>Level:</td>
          <td>{user.data.level}</td>
        </tr>}

        {/* TODO: Typical level-up */}

        {/* Time on level */}
        {data && <tr>
          <td>Time on level:</td>
          <td>
            {data.timeOnLevel !== undefined
              ? <DhmDuration seconds={data.timeOnLevel} />
              : <span className="text-desc">Not started yet</span>}
          </td>
        </tr>}

        {/* TODO: Level-up in */}

        {/* Items learned */}
        {data && <tr className="items-learned">
          <td>
            <Tooltip title="Guru or higher"><abbr>Items learned:</abbr></Tooltip>
          </td>
          <td>
            <span className="type radical">
              {nts(data.itemsLearnedRadical)}
              {sp}{TYPE_LABELS.radical[lbl]}
            </span>
            <span className="type kanji">
              {nts(data.itemsLearnedKanji)}
              {sp}{TYPE_LABELS.kanji[lbl]}
            </span>
            <span className="type vocab">
              {nts(data.itemsLearnedVocab)}
              {sp}{TYPE_LABELS.vocabulary[lbl]}
            </span>
          </td>
        </tr>}
      </tbody>
    </table>
  </SimpleCard>;
}
