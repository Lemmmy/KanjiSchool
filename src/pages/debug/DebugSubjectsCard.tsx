// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useEffect, useState } from "react";
import { Button, Form, Radio, Checkbox, InputNumber, Space } from "antd";

import { StoredSubject, StoredSubjectMap, SubjectType, useAssignments, useSubjects, useUserLevel } from "@api";
import { lut } from "@utils";

import { SubjectGrid } from "@comp/subjects/lists/grid";
import { makeRenderTooltipFn, SubjectRenderTooltipFn } from "@comp/subjects/lists/tooltip/SubjectTooltip";
import { Size } from "@comp/subjects/lists/grid/style.ts";
import { SimpleCard } from "@comp/SimpleCard.tsx";

interface Props {
  onAddSubject: (subject: StoredSubject) => void;
}

const SUBJECT_TYPES = ["radical", "kanji", "vocabulary"];
const SHOW = ["showJlpt", "showJoyo", "showFreq"];
interface FormValues {
  size: Size;
  filter: "current" | "lte" | "all";
  types: SubjectType[];
  colorBy: "type" | "srs";
  tooltipFn: "debug" | "subject";
  show: ("showJlpt" | "showJoyo" | "showFreq")[];
  limit?: number;
}
const INITIAL_VALUES: FormValues = {
  size: "tiny",
  filter: "current",
  types: ["radical", "kanji", "vocabulary"] as any,
  colorBy: "srs",
  tooltipFn: "debug",
  show: []
};

export function DebugSubjectsCard({
  onAddSubject
}: Props): JSX.Element {
  const [form] = Form.useForm<FormValues>();
  const [subjectList, setSubjectList] = useState<JSX.Element>();

  const subjects = useSubjects();
  const hasAssignments = !!useAssignments();
  const userLevel = useUserLevel();

  const renderTooltipDebug: SubjectRenderTooltipFn = useCallback((subject, assignment?) => {
    return <>
      Subject ID: <b>{subject.id}</b><br />
      {assignment && <>Assignment ID: <b>{assignment.id}</b></>}
      <Button type="primary" onClick={() => onAddSubject(subject)}>
        Add to self-study
      </Button>
    </>;
  }, [onAddSubject]);

  const renderList = useCallback((values: FormValues = INITIAL_VALUES) => {
    const s = lut(values.show);
    const renderTooltip = values.tooltipFn === "subject"
      ? makeRenderTooltipFn(s["showJlpt"], s["showJoyo"], s["showFreq"])
      : renderTooltipDebug;

    setSubjectList(renderSubjectList(
      subjects, userLevel,
      renderTooltip,
      values
    ) ?? undefined);
  }, [renderTooltipDebug, subjects, userLevel]);

  useEffect(() => {
    if (!form || !subjects) return;
    renderList();
  }, [form, subjects, renderList]);

  if (!subjects || !hasAssignments) return <b>Loading</b>;

  return <SimpleCard title="Subjects">
    {/* Assignment listing display controls */}
    <Form
      form={form}
      layout="inline"
      style={{ marginBottom: 24 }}
      initialValues={INITIAL_VALUES}
      onValuesChange={(_, v) => renderList(v)}
    >
      <Space size={[12, 12]} wrap>
        {/* Subject list display size */}
        <Form.Item name="size">
          <Radio.Group>
            <Radio.Button value="tiny">Tiny</Radio.Button>
            <Radio.Button value="small">Small</Radio.Button>
            <Radio.Button value="normal">Normal</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {/* Subject list filter */}
        <Form.Item name="filter">
          <Radio.Group>
            {/* Subjects at the user's current level */}
            <Radio.Button value="current">Current</Radio.Button>
            {/* Subjects less than or equal to the user's current level */}
            <Radio.Button value="lte">&lt;= Current</Radio.Button>
            {/* All subjects */}
            <Radio.Button value="all">All</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {/* Which subject lists to show */}
        <Form.Item name="types">
          <Checkbox.Group options={SUBJECT_TYPES} />
        </Form.Item>

        {/* Subject list color by */}
        <Form.Item name="colorBy" label="Color by">
          <Radio.Group>
            <Radio.Button value="type">Item type</Radio.Button>
            <Radio.Button value="srs">SRS stage</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {/* Subject list tooltip fn */}
        <Form.Item name="tooltipFn" label="Tooltip fn">
          <Radio.Group>
            <Radio.Button value="debug">Debug</Radio.Button>
            <Radio.Button value="subject">Subject</Radio.Button>
          </Radio.Group>
        </Form.Item>

        {/* Which things to show in the subject tooltip */}
        <Form.Item name="show">
          <Checkbox.Group options={SHOW} />
        </Form.Item>

        {/* Result limit */}
        <Form.Item label="Limit" name="limit">
          <InputNumber placeholder="Limit" />
        </Form.Item>
      </Space>
    </Form>

    {/* Subject listing */}
    {subjectList}
  </SimpleCard>;
}

function renderSubjectList(
  subjects: StoredSubjectMap | undefined,
  userLevel: number,
  renderTooltip: SubjectRenderTooltipFn,
  { size, filter, types, colorBy, limit }: FormValues
): JSX.Element | null {
  if (!subjects) return null;

  const filterFn = filter === "lte"
    ? (s: StoredSubject) => s.data.level <= userLevel
    : (filter === "current"
      ? (s: StoredSubject) => s.data.level === userLevel
      : () => true);

  const typeLut = lut(types);

  const subjectIds = Object.values(subjects)
    .filter(s => typeLut[s.object] && !s.data.hidden_at && filterFn(s))
    .map(s => s.id)
    .slice(0, limit);

  return <SubjectGrid
    colorBy={colorBy}
    size={size}
    subjectIds={subjectIds}
    renderTooltip={renderTooltip}
    hasVocabulary={size === "tiny" && typeLut["vocabulary"]}
  />;
}
