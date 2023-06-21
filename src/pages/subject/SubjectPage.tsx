// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";

import { PageLayout } from "@layout/PageLayout";

import { useParams } from "react-router-dom";

import { NormalizedSubjectType } from "@api";
import { SubjectInfo } from "./SubjectInfo";

import { useSubjectBySlug } from "@api";
import { getSubjectTitle } from "@utils";

interface Params {
  slug: string;
}

interface Props {
  type: NormalizedSubjectType;
}

export function SubjectPage({ type }: Props): JSX.Element | null {
  const { slug } = useParams<Params>();

  // Look up the subject by the slug.
  const subject = useSubjectBySlug(type, slug);
  const siteTitle = useMemo(() => getSubjectTitle(subject), [subject]);

  if (!subject) return null;

  return <PageLayout
    siteTitle={siteTitle}
    className="subject-page page-centered has-toc"
  >
    <SubjectInfo subject={subject} showToc />
  </PageLayout>;
}
