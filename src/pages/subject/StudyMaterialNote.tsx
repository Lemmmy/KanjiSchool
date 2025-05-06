// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, useState, useCallback } from "react";
import { Typography } from "antd";
import { EditOutlined, LoadingOutlined } from "@ant-design/icons";
import classNames from "classnames";

import {
  ApiStudyMaterial, ApiSubject, createStudyMaterial, StudyMaterialPartial,
  updateStudyMaterial
} from "@api";
import { SubjectInfoHint } from "@pages/subject/SubjectInfoHint.tsx";

const { Paragraph } = Typography;

interface Props {
  subject: ApiSubject;
  studyMaterial?: ApiStudyMaterial;
  type: "meaning" | "reading";
  className?: string;
  fallbackClassName?: string;
}

const bothTrigger: ("icon" | "text")[] = ["icon", "text"];

export function StudyMaterialNote({
  subject,
  studyMaterial,
  type,
  className,
  fallbackClassName
}: Props): React.ReactElement {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Store edits temporarily to show them
  const noteKey = type === "meaning" ? "meaning_note" : "reading_note";
  const [note, setNote] = useState(studyMaterial?.data[noteKey] ?? "");

  useEffect(() => {
    setNote(studyMaterial?.data[noteKey] ?? "");
  }, [studyMaterial, noteKey]);

  const onChange = useCallback((val: string) => {
    const oldVal = studyMaterial?.data[noteKey];
    const cleanVal = (val || "").trim() || null;
    const key = type === "meaning" ? "meaningNote" : "readingNote";
    const mate: StudyMaterialPartial = { [key]: cleanVal };

    // Don't do anything if the study material doesn't exist and cleanVal is
    // blank, or the value is unchanged
    if ((!studyMaterial && !cleanVal) || (cleanVal === oldVal)
      || (!cleanVal && !oldVal)) {
      setEditing(false);
      return;
    }

    setEditing(false);
    setSaving(true);
    setNote(cleanVal || ""); // Store temporarily to show immediately

    // Update if the study material already exists, otherwise create a new one
    const updatePromise = studyMaterial
      ? updateStudyMaterial(studyMaterial, mate)
      : createStudyMaterial(subject.id, mate);

    updatePromise
      .then(() => setSaving(false))
      .catch(console.error);
  }, [subject.id, studyMaterial, type, noteKey]);

  if (!note && !editing) {
    return <div className={classNames("text-sm", fallbackClassName)}>
      <a
        className="text-desc hover:text-white/70 light:hover:text-black/80"
        onClick={() => setEditing(true)}
      >
        <EditOutlined /> Add {type} notes
        {saving && <LoadingOutlined spin className="ml-xs" />}
      </a>
    </div>;
  }

  const header = <>
    My {type} notes
    {saving && <LoadingOutlined spin className="ml-xs" />}
  </>;

  return <SubjectInfoHint header={header} className={className}>
    <Paragraph
      editable={{
        editing,
        onStart: () => setEditing(true),
        onChange,
        onEnd: () => setEditing(false),
        maxLength: 255,
        autoSize: { maxRows: 5, minRows: 1 },
        tooltip: "Click to edit",
        triggerType: bothTrigger,
      }}

      className={classNames(
        "!left-0 !my-0",
        "[&_.ant-typography,&_.ant-typography_p]:mb-0"
      )}
    >
      {note}
    </Paragraph>
  </SubjectInfoHint>;
}
