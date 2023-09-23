// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { CheckboxChangeEvent } from "antd/lib/checkbox";
import classNames from "classnames";

import { PresetDropdownBtn, PresetStartSessionFn } from "@comp/preset-editor";
import { pluralN } from "@utils";

import { WithLessonsCheckbox } from "./SearchWithLessonsCheckbox.tsx";

export interface SelfStudyButtonProps {
  selfStudy?: boolean;
  results?: number;
  onSelfStudy: PresetStartSessionFn;
  withLessons: boolean;
  setWithLessons: (e: CheckboxChangeEvent) => void;
}

export function SearchSelfStudyButton({
  selfStudy,
  results,
  onSelfStudy,
  withLessons,
  setWithLessons
}: SelfStudyButtonProps): JSX.Element | null {
  if (results === 0) return null;

  // For self-study type, put the "With lessons" checkbox on the left.
  // For search type, put the "With lessons" checkbox on the right.
  const classes = classNames("flex", {
    "flex-row-reverse justify-end gap-sm": !selfStudy,
    "gap-xss": selfStudy
  });

  return <div className={classes}>
    <WithLessonsCheckbox
      withLessons={withLessons}
      setWithLessons={setWithLessons}
    />

    <PresetDropdownBtn
      type={selfStudy ? "primary" : undefined}
      presetType="review"
      start={onSelfStudy}
      className="!w-auto"
    >
      Self-study {results !== undefined && pluralN(results, "result")}
    </PresetDropdownBtn>
  </div>;
}
