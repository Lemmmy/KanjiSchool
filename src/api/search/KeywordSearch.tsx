// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FC, createContext, useState, useEffect, useMemo, useContext } from "react";

import { ApiSubjectKanji, StoredSubject, StoredSubjectMap, useSubjects } from "@api";

import Fuse from "fuse.js";
import { toKana } from "@comp/PseudoIme";

import Debug from "debug";
const debug = Debug("kanjischool:keyword-search");

export interface IndexedSubject {
  id: number;
  characters: string | null;
  meanings: string[];
  readings: string[];
}

export type KeywordSearchResult = Fuse.FuseResult<IndexedSubject>;
export type PerformSearchFn = (query: string, limit?: number) =>
  KeywordSearchResult[];
const emptyPerformSearch: PerformSearchFn = () => [];

interface KeywordSearchCtxRes {
  fuse?: Fuse<IndexedSubject>;
  performSearch: PerformSearchFn;
}
export const KeywordSearchContext = createContext<KeywordSearchCtxRes>({
  performSearch: emptyPerformSearch
});

const FUSE_OPTS: Fuse.IFuseOptions<IndexedSubject> = {
  keys: ["id", "characters", "meanings", "readings"],
  findAllMatches: true,
  minMatchCharLength: 0
};

export const KeywordSearchProvider: FC = ({ children }) => {
  const [fuse, setFuse] = useState<Fuse<IndexedSubject>>();
  const subjects = useSubjects();

  // Re-index and create the Fuse instance when the subjects change
  useEffect(() => {
    if (!subjects) return;

    // Index the subjects
    debug("initializing keyword search");
    const start = new Date();
    const data = indexSubjects(subjects);
    const end = new Date();
    debug("indexed %d items in %d ms", data.length, end.getTime() - start.getTime());

    // Build the Fuse instance
    const fuse = new Fuse(data, FUSE_OPTS);
    setFuse(fuse);
  }, [subjects]);

  const res: KeywordSearchCtxRes = useMemo(() => ({
    fuse,
    performSearch: fuse
      ? performSearch.bind(performSearch, fuse)
      : emptyPerformSearch
  }), [fuse]);

  return <KeywordSearchContext.Provider value={res}>
    {children}
  </KeywordSearchContext.Provider>;
};

/** Perform a keyword search against the subjects, indexed with Fuse. */
function performSearch(
  fuse: Fuse<IndexedSubject>,
  query: string,
  limit?: number
): KeywordSearchResult[] {
  const start = new Date();
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  // Convert the input to kana (using PseudoIme) for reading searches.
  const cleanKana = toKana(cleanQuery);
  debug("cleanQuery: %s (%s)", cleanQuery, cleanKana);

  const results = fuse.search(
    { $or: [
      { "characters": cleanQuery },
      { "characters": cleanKana },
      { "meanings": cleanQuery },
      { "readings": cleanQuery },
      { "readings": cleanKana },
      { "id": cleanQuery },
    ] },
    limit ? { limit } : undefined
  );
  const end = new Date();
  debug("search returned %d results in %d ms", results.length, end.getTime() - start.getTime());

  return results;
}

/** Index the searchable fields from the subjects, skipping invalid and hidden
 * subjects. */
function indexSubjects(subjects: StoredSubjectMap): IndexedSubject[] {
  const indexed: IndexedSubject[] = [];
  for (const subjectId in subjects) {
    const subject = subjects[subjectId];
    if (subject.data.hidden_at) continue;
    indexed.push(indexSubject(subject));
  }
  return indexed;
}

/** Isolate the searchable fields from a given subject, including filtering the
 * meanings and readings to only shown ones. */
function indexSubject(subject: StoredSubject): IndexedSubject {
  return {
    id: subject.id,
    characters: subject.data.characters,
    meanings: subject.data.meanings
      .filter(m => m.accepted_answer || m.primary)
      .map(m => m.meaning),
    readings: ((subject as ApiSubjectKanji).data.readings ?? undefined)
      ?.filter(m => m.accepted_answer || m.primary)
      .map(m => m.reading)
  };
}

export type KeywordSearchHookRes = [PerformSearchFn, Fuse<IndexedSubject> | undefined];
export function useKeywordSearch(): KeywordSearchHookRes {
  const { fuse, performSearch } = useContext(KeywordSearchContext);
  return useMemo(() => ([performSearch, fuse]), [performSearch, fuse]);
}
