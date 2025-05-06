// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { StoredSubject, useAssignmentBySubjectId } from "@api";
import { stringifySrsStage } from "@utils";

interface Props {
  subject: StoredSubject;
}

export function QuestionSrsStage({ subject }: Props): React.ReactElement | null {
  const assignment = useAssignmentBySubjectId(subject.id);
  const srsStage = assignment?.data.srs_stage;

  if (srsStage === undefined) return null;

  return <span className="absolute w-full text-center">
    {stringifySrsStage(srsStage)}
  </span>;
}
