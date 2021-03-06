// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectGridItem, SubjectGridItemProps } from "./SubjectGridItem";

// Only 'tiny' is supported right now, so no meaning or reading is necessary
// here at the moment.
export function GridItemVocab({
  subject,
  ...rest
}: SubjectGridItemProps): JSX.Element {
  if (subject.object !== "vocabulary")
    throw new Error("Using GridItemVocab for subject type " + subject.object);

  return <SubjectGridItem
    className="type-vocab"
    subject={subject}
    {...rest}
  />;
}
