// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState } from "react";
import { Space, Button, Table, Menu } from "antd";
import { ColumnsType } from "antd/lib/table";

import { PageLayout } from "@layout/PageLayout";

import { store } from "@app";

import { StoredAssignment, StoredSubject } from "@api";
import { SessionType } from "@session";
import { getLessonSessionOrderOptions, getReviewSessionOrderOptions, SessionOpts } from "@session/order/options";
import { pickSubjects } from "@session/pick";
import { isOverdue, nts } from "@utils";

import { getLessonSettingsGroup, getReviewSettingsGroup } from "../settings/SettingsSessions";
import { SubjectCharacters } from "@comp/subjects/SubjectCharacters";

import { sortBy } from "lodash-es";

import Debug from "debug";
const debug = Debug("kanjischool:debug-pick-test");

interface DataRow {
  subject: StoredSubject;
  assignment?: StoredAssignment;
  isOverdue: boolean;
}

function pick(type: SessionType): DataRow[] {
  const { pendingLessons, pendingReviews, subjects, assignments } = store.getState().sync;
  if (!pendingLessons) throw new Error("No pendingLessons available yet!");
  if (!pendingReviews) throw new Error("No pendingReviews available yet!");
  if (!subjects) throw new Error("No subjects available yet!");
  if (!assignments) throw new Error("No assignments available yet!");

  let sortedSubjects = [];
  let options: SessionOpts;

  if (type === "lesson") {
    // Pre-sort by lesson position before passing to the user-defined ordering
    const lessonSubjectIds = pendingLessons.map(l => l[1]);
    sortedSubjects = sortBy(lessonSubjectIds, [
      l => subjects[l].data.level,
      l => subjects[l].data.lesson_position,
      l => l
    ]);
    options = getLessonSessionOrderOptions();
  } else {
    sortedSubjects = pendingReviews.map(r => r[1]);
    options = getReviewSessionOrderOptions();
  }

  // TODO: self-study

  const finalOptions = { ...options, maxSize: 1000 };
  const [subjectAssignments] = pickSubjects(type, sortedSubjects, finalOptions);

  return subjectAssignments.map(([subject, assignment]) => ({
    subject,
    assignment,
    isOverdue: isOverdue([subject, assignment])
  }));
}

const COLUMNS: ColumnsType<DataRow> = [
  { key: "i", title: "i",
    render: (_, __, i) => <>{nts(i)}</> },
  { key: "chars", title: "Characters",
    render: (_, r) => <SubjectCharacters subject={r.subject} /> },
  { key: "id", dataIndex: "id", title: "Ass ID" },
  { key: "subjId", dataIndex: ["subject", "id"], title: "Subj ID" },
  { key: "type", dataIndex: ["subject", "object"], title: "Type" },
  { key: "level", dataIndex: ["subject", "data", "level"], title: "Level" },
  { key: "overdue", dataIndex: "isOverdue", title: "Overdue",
    render: v => <>{v ? "true" : "false"}</> },
];

export function Component(): JSX.Element {
  const [data, setData] = useState<DataRow[]>();

  function pickAndSet(type: SessionType) {
    const newData = pick(type);
    debug("data: %o", newData);
    setData(newData);
  }

  return <PageLayout siteTitle="Debug picktest" className="debug-page-picktest">
    <Menu mode="inline" className="big-menu" selectable={false}>
      {getLessonSettingsGroup()}
      {getReviewSettingsGroup()}
    </Menu>

    <Space>
      <Button onClick={() => pickAndSet("lesson")}>lesson</Button>
      <Button onClick={() => pickAndSet("review")}>review</Button>
    </Space>

    <Table<DataRow>
      dataSource={data}
      columns={COLUMNS}
      rowKey="id"
      size="small"
      pagination={false}
    />
  </PageLayout>;
}

