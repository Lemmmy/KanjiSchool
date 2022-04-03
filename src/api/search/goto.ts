// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { History } from "history";
import { SearchOrder, SearchParams, searchSubjects } from "@api";
import { gotoSession, startSession } from "@session";
import { SessionOpts } from "@session/order/options";

import { PerformSearchFn } from "./KeywordSearch";

import Debug from "debug";
const debug = Debug("kanjischool:search-goto");

export interface SearchParamsWithoutOrder extends Omit<SearchParams, "sortOrder"> {
  // Allow sortOrder to be optional, but default to "TYPE"
  sortOrder?: SearchOrder;
}

export function gotoSearch(
  history: History,
  params: SearchParamsWithoutOrder,
  startSearch?: boolean,
  hideForm?: boolean
): void {
  if (!params.sortOrder) params = { ...params, sortOrder: "TYPE" };
  pushSearchState(history, params as SearchParams, startSearch, hideForm);
}

export function pushSearchState(
  history: History,
  params: SearchParams,
  startSearch?: boolean,
  hideForm?: boolean
): void {
  history.push("/search", { params, startSearch, hideForm });
}

export function gotoSelfStudy(
  history: History,
  keywordSearch: PerformSearchFn,
  params: SearchParamsWithoutOrder,
  withLessons?: boolean,
  opts?: Partial<SessionOpts>
): void {
  if (!params.sortOrder) params = { ...params, sortOrder: "TYPE" };

  // Perform the search
  debug("beginning self-study search with params %o", params);
  const results = searchSubjects(params as SearchParams, keywordSearch);
  debug("self-study search returned %d results", results.length);

  // Get the subject IDs from the results set
  const subjectIds = results.map(([s]) => s.id);

  // Start and goto the session
  const state = startSession("self_study", subjectIds, withLessons, opts);
  gotoSession(history, state);
}
