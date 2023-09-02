// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useParams } from "react-router-dom";
import { NormalizedSubjectType, StoredSubject, useSubjectBySlug } from "@api";
import { useMemo } from "react";
import { getSubjectTitle } from "@utils";

export interface SubjectPageHook {
  subject: StoredSubject;
  siteTitle: string;
}

export function useSubjectPage(type: NormalizedSubjectType): SubjectPageHook {
  const { slug } = useParams();

  // Look up the subject by the slug.
  const subject = useSubjectBySlug(type, slug);
  const siteTitle = useMemo(() => getSubjectTitle(subject), [subject]);

  if (!subject) {
    throw new Response("Subject not found", { status: 404 });
  }

  return {
    subject,
    siteTitle
  };
}
