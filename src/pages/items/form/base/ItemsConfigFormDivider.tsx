// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Divider } from "antd";
import classNames from "classnames";

interface Props {
  label: ReactNode;
  className?: string;
}

export function ItemsConfigFormDivider({
  label,
  className
}: Props): JSX.Element | null {
  if (!label) return null;

  return <Divider
    orientation="left"
    className={classNames(
      "!mb-md before:!w-[16px] before:shrink-0 after:w-full",
      "before:!translate-y-px after:!translate-y-px", // 50% y makes the divider 2px thick, yuck
      className
    )}
  >
    {label}
  </Divider>;
}
