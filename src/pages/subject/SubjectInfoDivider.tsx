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
    className={classNames("!mt-[32px] before:w-[32px] before:shrink-0 after:w-full", className)}
  >
    {label}
  </Divider>;
}
