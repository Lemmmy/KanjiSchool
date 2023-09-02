// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, useCallback, useState } from "react";
import { Skeleton } from "antd";

import { PageLayout } from "@layout/PageLayout";

import { useNavigate, useLocation } from "react-router-dom";

import {
  groupSearchResults, SearchParams, SearchResultsGrouped, searchSubjects,
  useSubjects, useAssignments, useReviewStatistics, pushSearchState
} from "@api";
import { useKeywordSearch } from "@api/search/KeywordSearch";
import { SearchParamsForm } from "./SearchParamsForm";
import { SearchResultsList } from "./SearchResultsList";

import Debug from "debug";
const debug = Debug("kanjischool:advanced-search-page");


export interface SearchLocationState {
  params: SearchParams;
  startSearch?: boolean;
  hideForm?: boolean;
}

interface Props {
  selfStudy?: boolean;
}

export function AdvancedSearchPageBase({ selfStudy }: Props): JSX.Element {
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
  }, [location, onSearch, subjects, assignments, reviewStatistics, keywordSearch]);

  return <PageLayout
    siteTitle={selfStudy ? "Self-study" : "Advanced search"}
    title={selfStudy ? "Self-study" : "Advanced search"}
    className="advanced-search-page"
  >
    {/* Search parameters form */}
    <SearchParamsForm
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
      <div style={{ maxWidth: 920, margin: "0 auto" }}>
        <Skeleton />
      </div>
    )}

    {/* Bottom margin (TODO: something is very weird here) */}
    <div style={{ height: 1 }} />
  </PageLayout>;
}
