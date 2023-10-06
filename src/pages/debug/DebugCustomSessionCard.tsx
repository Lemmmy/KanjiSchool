// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useMemo } from "react";
import { Form, Row, Input, Dropdown, Menu } from "antd";

import { useNavigate } from "react-router-dom";

import { StoredSubject } from "@api";
import { gotoSession, SessionType, startSession } from "@session";
import { SimpleCard } from "@comp/SimpleCard.tsx";

const CSV_DIGITS = /^(?:\d+,\s*)*\d+$/;

interface FormValues {
  subjectIds: string;
}

export type HookRes = [
  JSX.Element, // Card
  (subject: StoredSubject) => void // onAddSubject
];

// Clean and normalize the subject IDs
function normalizeSubjectIds(value?: string): number[] {
  return (value || "")
    .split(/,\s*/)
    .map((s: string) => parseInt(s.trim()))
    .filter((n: number) => !isNaN(n));
}

export function useCustomSessionCard(): HookRes {
  const [form] = Form.useForm<FormValues>();

  const navigate = useNavigate();

  // Add a new subject to the custom session input
  const onAddSubject = useCallback((subject: StoredSubject) => {
    const value = form.getFieldValue("subjectIds");
    const ids = normalizeSubjectIds(value);

    // Add the new subject ID
    ids.push(subject.id);
    form.setFieldsValue({ subjectIds: ids.join(",") });
  }, [form]);

  // Start a session of any type using the specified subject IDs
  const onStartSession = useCallback(async (type: SessionType) => {
    const values = await form.validateFields();
    const ids = normalizeSubjectIds(values.subjectIds);
    const state = startSession(type, ids);
    gotoSession(navigate, state);
  }, [navigate, form]);
  const onStartSelfStudy = useCallback(() =>
    onStartSession("self_study"), [onStartSession]);

  const menu = useMemo(() => <Menu>
    <Menu.Item key="1" onClick={() => onStartSession("lesson")}>
      Lesson
    </Menu.Item>
    <Menu.Item key="2" onClick={() => onStartSession("review")}>
      Review
    </Menu.Item>
  </Menu>, [onStartSession]);

  const card = useMemo(() => <SimpleCard title="Custom session">
    {/* Custom session form */}
    <Row style={{ marginBottom: 16 }}>
      <Form form={form} layout="inline">
        {/* Subject IDs */}
        <Form.Item
          label="Subjects (CSV)"
          name="subjectIds"
          rules={[{ pattern: CSV_DIGITS }]}
        >
          <Input type="text" placeholder="Subjects" />
        </Form.Item>

        {/* Self-study/lesson/review dropdown submit */}
        <Dropdown.Button
          onClick={onStartSelfStudy}
          overlay={menu}
        >
          Self-study
        </Dropdown.Button>
      </Form>
    </Row>
  </SimpleCard>, [form, onStartSelfStudy, menu]);

  return [card, onAddSubject];
}
