// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import classNames from "classnames";

import { ApiSubjectKanjiInner } from "@api";
import { SubjectMarkup } from "@comp/subjects/SubjectMarkup.tsx";

interface Props {
  header: ReactNode;
  data?: ApiSubjectKanjiInner;
  children?: ReactNode;
  className?: string;
}

export function SubjectInfoHint({
  header,
  data,
  children,
  className
}: Props): JSX.Element | null {
  const hasData = data?.meaning_hint || children;
  if (!hasData) return null;

  return <div className={classNames("mt-lg p-md bg-container rounded", className)}>
    <h4 className="mt-0 mb-xs text-desc text-sm font-bold uppercase">
      {header}
    </h4>

    {children || (data?.meaning_hint && <SubjectMarkup>
      {data.meaning_hint}
    </SubjectMarkup>)}
  </div>;
}
