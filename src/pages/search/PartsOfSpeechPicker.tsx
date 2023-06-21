// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useMemo } from "react";
import { Form, Select, Tag } from "antd";
import { CustomTagProps } from "rc-select/lib/BaseSelect";

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { slugifyPartOfSpeech } from "@utils";

export function PartsOfSpeechPicker({ ...props }: any): JSX.Element {
  const partsOfSpeech = useSelector((s: RootState) => s.sync.partsOfSpeechCache, shallowEqual);
  const options = useMemo(() => {
    const values = Object.keys(partsOfSpeech || {});
    values.sort((a, b) => a.localeCompare(b, undefined, { ignorePunctuation: true }));
    return values.map(v => ({ label: v, value: v }));
  }, [partsOfSpeech]);

  const tagRender = useCallback(({ value, label, closable, onClose }: CustomTagProps) => {
    return <Tag
      closable={closable} onClose={onClose}
      className={"part-of-speech " + slugifyPartOfSpeech(value.toString())}
      style={{ marginRight: 3 }}
    >
      {label}
    </Tag>;
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
