// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, useCallback, useState } from "react";

import { PageLayout } from "@layout/PageLayout";

import { useNavigate, useLocation } from "react-router-dom";

import {
  groupSearchResults, SearchParams, SearchResultsGrouped, searchSubjects,
  useSubjects, useAssignments, useReviewStatistics, pushSearchState
} from "@api";
import { useKeywordSearch } from "@api/search/KeywordSearch";
import { SearchParamsConfig } from "./SearchParamsConfig";
import { SearchResultsList } from "./SearchResultsList";

import Debug from "debug";
import { SimpleSkeleton } from "@comp/SimpleSkeleton.tsx";
const debug = Debug("kanjischool:advanced-search-page");

export interface SearchLocationState {
  params: SearchParams;
  startSearch?: boolean;
  hideForm?: boolean;
}

interface Props {
  selfStudy?: boolean;
  title?: string;
}

export function AdvancedSearchPageBase({ selfStudy, title }: Props): JSX.Element {
  const navigate = useNavigate();
  const state = useLocation()?.state as SearchLocationState | null;
  const [keywordSearch] = useKeywordSearch();

  const [results, setResults] = useState<SearchResultsGrouped>();
  const [searching, setSearching] = useState(false);

  // Used to prevent searching if data is not yet available.
  const subjects = !!useSubjects();
  const assignments = !!useAssignments();
  const reviewStatistics = !!useReviewStatistics();

  // Whether to hide the search form by default.
  const hideForm = state?.hideForm;

  const onSearch = useCallback((params: SearchParams) => {
    // Push the latest params into the history stack, which will trigger the
    // search via the useEffect
    pushSearchState(navigate, params, true);
  }, [navigate]);

  // If we came here from gotoSearch with startSearch, or a history state change
  // (e.g. triggered by the search form button), perform the search. Don't
  // attempt to perform a search if there are no subjects or assignments loaded
  // yet.
  useEffect(() => {
    if (!state) return;
    const { params, startSearch } = state;
    if (!params || !startSearch) return;

    debug("setSearching true");
    setSearching(true);

    // Don't search if no data is available yet.
    if (!subjects || !assignments || !reviewStatistics) return;

    // Perform the search
    debug("beginning search with params %o", params);
    const results = searchSubjects(params, keywordSearch);
    debug("search returned %d results", results.length);
    const grouped = groupSearchResults(params, results);
    debug("searched grouped into %d groups: %o", grouped.groups.length, grouped);

    setResults(grouped);
    setSearching(false);
  }, [state, onSearch, subjects, assignments, reviewStatistics, keywordSearch]);

  return <PageLayout
    siteTitle={title}
    title={title}
    headerClassName="max-w-[960px] mx-auto"
  >
    {/* Search parameters form */}
    <SearchParamsConfig
      results={results?.total}
      initialParams={state?.params}
      hideForm={hideForm}
      showQueryInput={!selfStudy}
      selfStudy={selfStudy}
      onSearch={onSearch}
    />

    {/* Display the results list if available */}
    {results && results.total > 0 && (
      <SearchResultsList groups={results.groups} />
    )}

    {/* Display a skeleton when loading */}
    {!results && searching && (
      <div className="max-w-[920px] mx-auto">
        <SimpleSkeleton />
      </div>
    )}

    {/* Bottom margin (TODO: something is very weird here) */}
    <div className="h-px" />
  </PageLayout>;
}
