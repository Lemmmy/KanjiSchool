// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { StoredSubject, useAssignmentBySubjectId } from "@api";
import { stringifySrsStage } from "@utils";

interface Props {
  subject: StoredSubject;
}

export function QuestionSrsStage({ subject }: Props): JSX.Element | null {
  const assignment = useAssignmentBySubjectId(subject.id);
  const srsStage = assignment?.data.srs_stage;

  if (srsStage === undefined) return null;

  return <span className="session-srs">
    {stringifySrsStage(srsStage)}
  </span>;
}
