// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import classNames from "classnames";

interface Props {
  header: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function SubjectInfoHint({
  header,
  children,
  className
}: Props): JSX.Element | null {
  if (!children) return null;

  return <div className={classNames("mt-lg p-md bg-container rounded", className)}>
    <h4 className="mt-0 mb-xs text-desc text-sm font-bold uppercase">
      {header}
    </h4>

    {children}
  </div>;
}
