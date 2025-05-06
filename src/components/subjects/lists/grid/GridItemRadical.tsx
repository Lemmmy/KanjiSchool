// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectGridItem, SubjectGridItemProps } from "./SubjectGridItem";
import { getOneMeaning } from "@utils";

export function GridItemRadical({
  subject,
  hideMeaning,
  ...rest
}: SubjectGridItemProps): React.ReactElement | null {
  if (subject.object !== "radical")
    throw new Error("Using GridItemRadical for subject type " + subject.object);

  // First available primary meaning
  const meaning = getOneMeaning(subject);

  return <SubjectGridItem
    subject={subject}
    {...rest}
  >
    {/* Primary meaning */}
    {!hideMeaning && <span className="text-xs leading-[1.3]">
      {meaning}
    </span>}
  </SubjectGridItem>;
}
