// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode, useMemo } from "react";

import { StoredAssignment, StoredSubject } from "@api";
import { SubjectTooltipInner } from "@comp/subjects/lists/tooltip/SubjectTooltipInner.tsx";

export type SubjectRenderTooltipFn =
  (subject: StoredSubject, assignment?: StoredAssignment) => ReactNode;

export const makeRenderTooltipFn = (
  showJlpt?: boolean,
  showJoyo?: boolean,
  showFreq?: boolean
): SubjectRenderTooltipFn =>
  (subject: StoredSubject, assignment?: StoredAssignment): ReactNode => (
    <SubjectTooltipInner
      subject={subject} assignment={assignment}
      showJlpt={showJlpt} showJoyo={showJoyo} showFreq={showFreq}
    />
  );

export const useDefaultRenderTooltipFn =
  (fn?: SubjectRenderTooltipFn): SubjectRenderTooltipFn =>
    useMemo(() => fn || makeRenderTooltipFn(), [fn]);
