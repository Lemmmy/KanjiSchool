// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Dispatch, SetStateAction, useState } from "react";
import { Space, Divider, Descriptions, Typography, Radio, Checkbox, Row, Col, Button } from "antd";

import { HintStageObject, HINT_STAGE_OBJECTS, SubjectHintStage } from "../hintStages";
import { SubjectInfoProps } from "../SubjectInfo";

import * as api from "@api";
import { normalizeVocabType } from "@utils";
import { StoredAssignment, StoredSubject } from "@api";

const { Paragraph } = Typography;

interface Props extends SubjectInfoProps {
  setUseHintStage: Dispatch<SetStateAction<boolean | undefined>>;
  setQuestionType: Dispatch<SetStateAction<"meaning" | "reading" | undefined>>;
  hintStage: number;
  setHintStage: Dispatch<SetStateAction<SubjectHintStage>>;
  show: (object: HintStageObject) => boolean;
}

type DebugTab = "hidden" | "subject" | "assignment";

export default function SubjectInfoDebug({
  subject,
  useHintStage, setUseHintStage,
  questionType, setQuestionType,
  hintStage, setHintStage,
  show
}: Props): React.ReactElement {
  const objectType = subject.object;

  const assignments = api.useAssignments();
  const assignment = api.getAssignmentBySubject(assignments, subject.id);

  return <>
    <Divider orientation="left">Debug info</Divider>
    <div className="text-sm">
      {/* General info */}
      <Descriptions
        title="General info"
        size="small"
        bordered
        style={{ marginBottom: 24 }}
      >
        <Descriptions.Item label="Object type">{objectType}</Descriptions.Item>
        <Descriptions.Item label="Normalized object type">{normalizeVocabType(objectType)}</Descriptions.Item>
        <Descriptions.Item label="Question type">{questionType || "none"}</Descriptions.Item>
        <Descriptions.Item label="Hint stage"><b>{hintStage}</b></Descriptions.Item>

        <Descriptions.Item label="Subject ID">{subject.id}</Descriptions.Item>
        <Descriptions.Item label="Assignment ID">{assignment?.id || "none"}</Descriptions.Item>
      </Descriptions>

      {/* Hint stage showing/hiding */}
      <h3>Hint stage visibility</h3>
      <Row style={{ width: "100%", marginBottom: 16 }}>
        {/* Using hint stage override */}
        <Col span={8}>
          <h4>Using hint stage</h4>
          <Checkbox checked={useHintStage} onChange={e => setUseHintStage(e.target.checked)}>
            Use hint stage
          </Checkbox>
        </Col>

        {/* Question type override */}
        <Col span={8}>
          <h4>Question type</h4>
          <Radio.Group buttonStyle="solid" value={questionType} onChange={e => setQuestionType(e.target.value)}>
            <Radio.Button value={undefined}>None</Radio.Button>
            <Radio.Button value="meaning">Meaning</Radio.Button>
            <Radio.Button value="reading">Reading</Radio.Button>
          </Radio.Group>
        </Col>

        {/* Hint stage override */}
        <Col span={8}>
          <h4>Hint stage</h4>
          <Radio.Group buttonStyle="solid" value={hintStage} onChange={e => setHintStage(e.target.value)}>
            <Radio.Button value={0}>0</Radio.Button>
            <Radio.Button value={1}>1</Radio.Button>
            <Radio.Button value={2}>2</Radio.Button>
          </Radio.Group>
        </Col>
      </Row>

      {/* Hint stage values */}
      <Space wrap className="mb-lg">
        {HINT_STAGE_OBJECTS.map(hs => (
          <span key={hs} className={show(hs) ? "text-green" : "text-desc"}>{hs}</span>
        ))}
      </Space>

      {/* JSON dump tabs */}
      <DebugTabs subject={subject} assignment={assignment} />
    </div>
  </>;
}

interface DebugTabsProps {
  subject: StoredSubject;
  assignment?: StoredAssignment;
}

function DebugTabs({ subject, assignment }: DebugTabsProps): React.ReactElement {
  const [tab, setTab] = useState<DebugTab>("hidden");

  return <>
    <h3>JSON dumps (internal representation)</h3>

    <Button disabled={tab === "hidden"} onClick={() => setTab("hidden")}>Hidden</Button>
    <Button disabled={tab === "subject"} onClick={() => setTab("subject")}>Subject</Button>
    <Button disabled={tab === "assignment"} onClick={() => setTab("assignment")}>Assignment</Button>

    {tab === "subject" && (
      <Paragraph copyable>
        <pre className="!mt-0 !border-t-0 !rounded-t-none text-sm">
          {JSON.stringify(subject, undefined, 2).trim()}
        </pre>
      </Paragraph>
    )}

    {tab === "assignment" && (
      <Paragraph copyable>
        <pre className="!mt-0 !border-t-0 rounded-t-none text-sm">
          {JSON.stringify(assignment, undefined, 2).trim()}
        </pre>
      </Paragraph>
    )}
  </>;
}
