// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import { StoredSubjectMap, StoredSubject, NormalizedSubjectType } from "@api";

export const useSubjects = (): StoredSubjectMap | undefined =>
  useAppSelector(s => s.subjects.subjects);

export function useSubject(id?: number): StoredSubject | undefined {
  const subject = useAppSelector(s => s.subjects.subjects?.[id || -1], shallowEqual);
  return id !== undefined ? subject : undefined;
}

export function useSubjectBySlug(type: NormalizedSubjectType, slug: string | undefined): StoredSubject | undefined {
  const id = useAppSelector(s => slug ? s.subjects.slugCache?.[type][slug] : undefined);
  return useAppSelector(s => s.subjects.subjects?.[id || -1], shallowEqual);
}

export const useHasSubjects = (): boolean =>
  useAppSelector(s => !!s.subjects.subjects);
