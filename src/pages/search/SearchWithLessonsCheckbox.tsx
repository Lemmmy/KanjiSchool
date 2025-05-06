// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";

interface Props {
  withLessons: boolean;
  setWithLessons: (e: CheckboxChangeEvent) => void;
}

export function WithLessonsCheckbox({
  withLessons,
  setWithLessons
}: Props): React.ReactElement {
  return <Checkbox
    className="flex items-center"
    onChange={setWithLessons}
    checked={withLessons}
  >
    With lessons
  </Checkbox>;
}
