// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectGridItem, SubjectGridItemProps } from "./SubjectGridItem";

// Generic grid item that does nothing more than display the subject characters.
export function GridItemGeneric({
  subject,
  ...rest
}: SubjectGridItemProps): JSX.Element {
  return <SubjectGridItem
    className="type-generic"
    subject={subject}
    {...rest}
  />;
}
