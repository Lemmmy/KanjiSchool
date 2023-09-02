// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { StoredSubjectMap, StoredSubject, NormalizedSubjectType } from "@api";

export const useSubjects = (): StoredSubjectMap | undefined =>
  useSelector((s: RootState) => s.sync.subjects);

export function useSubject(id?: number): StoredSubject | undefined {
  const subject = useSelector((s: RootState) => s.sync.subjects?.[id || -1], shallowEqual);
  return id !== undefined ? subject : undefined;
}

export function useSubjectBySlug(type: NormalizedSubjectType, slug: string | undefined): StoredSubject | undefined {
  const id = useSelector((s: RootState) => slug ? s.sync.slugCache?.[type][slug] : undefined);
  return useSelector((s: RootState) => s.sync.subjects?.[id || -1], shallowEqual);
}

export const useHasSubjects = (): boolean =>
  useSelector((s: RootState) => !!s.sync.subjects);
