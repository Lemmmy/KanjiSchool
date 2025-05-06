// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { PageLayout } from "@layout/PageLayout";

import { SubjectInfo } from "./SubjectInfo";
import { SubjectPageHook } from "@pages/subject/useSubjectPage.ts";

export function SubjectPage({ siteTitle, subject }: SubjectPageHook): React.ReactElement | null {
  return <PageLayout
    siteTitle={siteTitle}
    centered
    hasToc
  >
    <SubjectInfo
      subject={subject}
      showToc
      showQueueButton
    />
  </PageLayout>;
}
