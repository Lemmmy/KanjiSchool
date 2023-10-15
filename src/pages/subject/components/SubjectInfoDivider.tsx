// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Divider } from "antd";
import classNames from "classnames";

interface Props {
  label: ReactNode;
  className?: string;
}

export function SubjectInfoDivider({
  label,
  className
}: Props): JSX.Element | null {
  if (!label) return null;

  return <Divider
    orientation="left"
    className={classNames(
      "flex !mt-[32px]",
      "after:flex-1 after:sm:!w-full",
      "before:!w-0 before:flex-grow before:shrink-0 before:sm:!w-[32px] before:sm:!flex-grow-0",
      "before:!translate-y-px after:!translate-y-px", // 50% y makes the divider 2px thick, yuck
      className
    )}
  >
    {label}
  </Divider>;
}
