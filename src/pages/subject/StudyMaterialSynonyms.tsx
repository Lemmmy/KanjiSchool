// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useEffect, useState } from "react";
import { Select } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";

import {
  ApiSubject, ApiStudyMaterial, createStudyMaterial, StudyMaterialPartial,
  updateStudyMaterial
} from "@api";

import { shallowEqual } from "fast-equals";

interface Props {
  subject: ApiSubject;
  studyMaterial?: ApiStudyMaterial;
}

export function StudyMaterialSynonyms({
  subject,
  studyMaterial
}: Props): JSX.Element {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [synonyms, setSynonyms] =
    useState<string[]>(studyMaterial?.data.meaning_synonyms ?? []);

  useEffect(() => {
    setSynonyms(studyMaterial?.data.meaning_synonyms ?? []);
  }, [studyMaterial]);

  const onChange = useCallback((val: string[]) => {
    const oldVals = studyMaterial?.data.meaning_synonyms || [];
    const cleanVals = (val || []).map(v => v.trim() || "").filter(v => !!v);
    const mate: StudyMaterialPartial = { meaningSynonyms: cleanVals };

    // Don't do anything if the study material doesn't exist and cleanVal is
    // empty, or the value is unchanged
    if ((!studyMaterial && !cleanVals.length)
      || shallowEqual(cleanVals, oldVals)
      || (!cleanVals.length && !oldVals.length)) {
      setEditing(false);
      return;
    }

    setEditing(false);
    setSaving(true);
    setSynonyms(cleanVals || []); // Store temporarily to show immediately

    // Update if the study material already exists, otherwise create a new one
    const updatePromise = studyMaterial
      ? updateStudyMaterial(studyMaterial, mate)
      : createStudyMaterial(subject.id, mate);

    updatePromise
      .then(() => setSaving(false))
      .catch(console.error);
  }, [subject.id, studyMaterial]);

  if (!synonyms.length && !editing) {
    return <div className="study-material-synonyms-add">
      <a onClick={() => setEditing(true)}>
        <PlusOutlined /> Add synonyms
        {saving && <LoadingOutlined spin />}
      </a>
    </div>;
  }

  return <div className="subject-info-hint subject-info-study-material-synonyms">
    <span className="hint-title study-material-synonyms-title">
      My synonyms
      {saving && <LoadingOutlined spin />}
    </span>

    <Select
      placeholder="My synonyms"
      mode="tags"
      maxTagCount={5}
      style={{ width: "100%" }}
      notFoundContent="Press enter to add synonym"
      value={synonyms}
      onChange={onChange}
    />
  </div>;
}
