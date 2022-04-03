// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Form, Select, } from "antd";

import { JLPT_KEYS, JOYO_KEYS } from "@utils";

type Type = "jlpt" | "joyo";
interface Props {
  type: Type;
}

const LABELS: Record<Type, string> =
  { jlpt: "JLPT levels", joyo: "Jōyō grades" };
const NAMES: Record<Type, string> =
  { jlpt: "jlptLevels", joyo: "joyoGrades" };

export function JlptJoyoPicker({
  type,
  ...props
}: Props): JSX.Element {
  const keys = type === "jlpt" ? JLPT_KEYS : JOYO_KEYS;

  return <Form.Item label={LABELS[type]} name={NAMES[type]} {...props}>
    <Select
      mode="multiple"
      allowClear
      listHeight={400}
    >
      {/* "None" option for kanji that aren't in JLPT/Jōyō */}
      <Select.Option key={"none"} value={-1}>None</Select.Option>

      {/* Get the JLPT/Jōyō level options */}
      {keys.map(([k, name]) =>
        <Select.Option key={k} value={k}>{name}</Select.Option>)}
    </Select>
  </Form.Item>;
}
