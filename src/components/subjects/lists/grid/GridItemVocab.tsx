// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectGridItem, SubjectGridItemProps } from "./SubjectGridItem";
import { isVocabularyLike } from "@utils";

// Only 'tiny' is supported right now, so no meaning or reading is necessary
// here at the moment.
export function GridItemVocab({
  subject,
  ...rest
}: SubjectGridItemProps): JSX.Element {
  if (!isVocabularyLike(subject)) {
    throw new Error("Using GridItemVocab for subject type " + subject.object);
  }

  return <SubjectGridItem
    subject={subject}
    {...rest}
  />;
}
