// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useEffect, useState } from "react";
import { Select } from "antd";
import { PlusOutlined, LoadingOutlined } from "@ant-design/icons";
import classNames from "classnames";

import {
  ApiSubject, ApiStudyMaterial, createStudyMaterial, StudyMaterialPartial,
  updateStudyMaterial
} from "@api";

import { shallowEqual } from "fast-equals";
import { SubjectInfoHint } from "@pages/subject/SubjectInfoHint.tsx";

interface Props {
  subject: ApiSubject;
  studyMaterial?: ApiStudyMaterial;
  className?: string;
  fallbackClassName?: string;
}

export function StudyMaterialSynonyms({
  subject,
  studyMaterial,
  className,
  fallbackClassName
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
    return <div className={classNames("text-sm", fallbackClassName)}>
      <a
        className="text-desc hover:text-white/70 light:hover:text-black/80"
        onClick={() => setEditing(true)}
      >
        <PlusOutlined /> Add synonyms
        {saving && <LoadingOutlined spin className="ml-xs" />}
      </a>
    </div>;
  }

  const header = <>
    My synonyms
    {saving && <LoadingOutlined spin className="ml-xs" />}
  </>;

  return <SubjectInfoHint header={header} className={className}>
    <Select
      placeholder="My synonyms"
      mode="tags"
      maxTagCount={5}
      className="w-full"
      notFoundContent={<div className="text-desc px-sm py-xss">
        Press enter to add synonym
      </div>}
      value={synonyms}
      onChange={onChange}
    />
  </SubjectInfoHint>;
}
