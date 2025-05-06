// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Form, Select } from "antd";
import type { CustomTagProps } from "rc-select/lib/BaseSelect";
import { useCallback, useMemo } from "react";

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import { PartOfSpeech } from "@pages/subject/PartsOfSpeech";

export function PartsOfSpeechPicker({ ...props }: any): React.ReactElement {
  const partsOfSpeech = useAppSelector(s => s.subjects.partsOfSpeechCache, shallowEqual);
  const options = useMemo(() => {
    const values = Object.keys(partsOfSpeech || {});
    values.sort((a, b) => a.localeCompare(b, undefined, { ignorePunctuation: true }));
    return values.map(v => ({ label: v, value: v }));
  }, [partsOfSpeech]);

  const tagRender = useCallback(({ value, closable, onClose }: CustomTagProps) => {
    return <PartOfSpeech
      partOfSpeech={value?.toString() ?? ""}
      onClose={onClose}
      closable={closable}
      className="mr-1"
    />;
  }, []);

  return <Form.Item label="Parts of speech" name="partsOfSpeech" {...props}>
    <Select
      mode="multiple"
      allowClear
      tagRender={tagRender}
      options={options}
    />
  </Form.Item>;
}
