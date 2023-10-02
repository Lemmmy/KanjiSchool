// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectPage } from "@pages/subject/SubjectPage.tsx";
import { useSubjectPage } from "@pages/subject/useSubjectPage.ts";

export function Component() {
  const { subject, siteTitle } = useSubjectPage("radical");
  return <SubjectPage subject={subject} siteTitle={siteTitle} />;
}
