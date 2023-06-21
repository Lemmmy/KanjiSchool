// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectGridItem, SubjectGridItemProps } from "./SubjectGridItem";
import { getOneMeaning } from "@utils";

export function GridItemRadical({
  subject,
  hideMeaning,
  ...rest
}: SubjectGridItemProps): JSX.Element | null {
  if (subject.object !== "radical")
    throw new Error("Using GridItemRadical for subject type " + subject.object);

  // First available primary meaning
  const meaning = getOneMeaning(subject);

  return <SubjectGridItem
    subject={subject}
    className="type-radical"
    {...rest}
  >
    {/* Primary meaning */}
    {!hideMeaning && <span className="txt meaning radical-meaning">
      {meaning}
    </span>}
  </SubjectGridItem>;
}
