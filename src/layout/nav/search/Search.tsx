// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useMemo, useRef, ReactNode, Dispatch, SetStateAction, useCallback } from "react";
import { AutoComplete, Input, Tooltip } from "antd";
import { RefSelectProps } from "antd/lib/select";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import classNames from "classnames";

import { useNavigate, useMatch } from "react-router-dom";
import { RootState } from "@store";
import { useSelector } from "react-redux";

import { GlobalHotKeys } from "react-hotkeys";
import { ctrl, getSubjectUrl, useBooleanSetting } from "@utils";

import { gotoSearch, useSubjects } from "@api";
import { KeywordSearchResult, PerformSearchFn, useKeywordSearch } from "@api/search/KeywordSearch";
import { throttle, debounce } from "lodash-es";
import { SearchResultEl } from "./SearchResult";
import { toKana } from "@comp/PseudoIme";

import { useHandwritingInput } from "./handwriting/HandwritingInput";

import * as Sentry from "@sentry/react";
import Debug from "debug";
const debug = Debug("kanjischool:layout-nav-search");

const SEARCH_THROTTLE = 400;
const SEARCH_RESULT_LIMIT = 10;

const KEY_MAP = {
  SEARCH: ["command+k", "ctrl+k"],
  SEARCH_WITH_HANDWRITING: ["command+shift+h", "ctrl+shift+h"],
  ADV_SEARCH: ["command+shift+k", "ctrl+shift+k"],
};

interface AutocompleteOption {
  value: string;
  label: ReactNode;
}

function performAutocomplete(
  query: string,
  keywordSearch: PerformSearchFn,
  setResults: Dispatch<SetStateAction<KeywordSearchResult[] | undefined>>
): void {
  debug("performing search autocomplete for %s", query);

  try {
    const results = keywordSearch(query, SEARCH_RESULT_LIMIT);
    setResults(results);
  } catch (err) {
    Sentry.withScope(scope => {
      scope.setTag("search-query", query);
      Sentry.captureException(err);
      console.error(err);
    });
  }
}

export function Search(): JSX.Element {
  const subjects = useSubjects();
  const [keywordSearch] = useKeywordSearch();

  const navigate = useNavigate();
  const bps = useBreakpoint();

  const [value, setValue] = useState("");
  const [results, setResults] = useState<KeywordSearchResult[] | undefined>();
  const [open, setOpen] = useState(false);

  // Used to focus the search when the hotkey is received, or de-focus it when
  // a search result is selected
  const autocompleteRef = useRef<RefSelectProps | null>(null);

  const debouncedAutocomplete = useMemo(() => debounce(performAutocomplete, SEARCH_THROTTLE), []);
  const throttledAutocomplete = useMemo(() => throttle(performAutocomplete, SEARCH_THROTTLE), []);

  const disableInSession = useBooleanSetting("sessionDisableSearch");
  const inSession = useSelector((s: RootState) => s.session.ongoing);
  const inSessionRoute = useMatch("/(.*)/session");
  const disabled = disableInSession && inSession && !!inSessionRoute;

  const onAutocomplete = useCallback((query: string) => {
    debug("onAutocomplete: %s", query);

    if (!query?.trim()) {
      setResults(undefined);
      return;
    }

    // Based on this article:
    // https://www.peterbe.com/plog/how-to-throttle-and-debounce-an-autocomplete-input-in-react
    // Eagerly use `throttle` for short inputs, and patiently use `debounce` for
    // longer inputs.
    const fn = query.length < 5
      ? throttledAutocomplete
      : debouncedAutocomplete;
    fn(query, keywordSearch, setResults);
  }, [debouncedAutocomplete, throttledAutocomplete, keywordSearch]);

  // Version of setValue that also immediately triggers onAutocomplete
  const setValueAutocomplete = useCallback((query: string | ((query: string) => string)) => {
    if (typeof query === "string") {
      setValue(query);
      onAutocomplete(query);
    } else {
      // Get the new value based on the old one before doing the song and dance
      setValue(oldValue => {
        const newValue = query(oldValue);
        onAutocomplete(newValue);
        return newValue;
      });
    }
  }, [onAutocomplete]);

  // Handwriting input prompt open button + the canvas popover itself. hwVisible
  // will be used to shift the autocomplete results overlay if necessary
  const [hwPopover, hwButton, hwVisible, hwSetVisible] =
    useHandwritingInput(setValueAutocomplete);
  // Whether to always open the handwriting input when focusing the
  // search input
  const hwAlwaysOpen = useBooleanSetting("searchAlwaysHandwriting");

  /** Open the handwriting input prompt on focus if desired */
  function onFocus() {
    setOpen(true);
    if (hwAlwaysOpen) hwSetVisible(true);
  }

  function onBlur() {
    setOpen(false);
    hwSetVisible(false);
  }

  /** Navigate to the selected autocomplete result. */
  function onSelect(query: string) {
    debug("onSelect %s", query);

    // Reset the search value when a result is selected. This is because,
    // otherwise, the internal value (the subject ID) would remain in there,
    // which would look pretty odd.
    setValue("");

    // If we're still loading the results, don't search just yet.
    if (!subjects || !results) return;

    // Get the subject
    const subjectId = parseInt(query);
    if (isNaN(subjectId)) throw new Error("Invalid subject ID!");
    const subject = subjects[subjectId];
    if (!subject) throw new Error("Subject not found!");

    // Navigate to the subject page
    navigate(getSubjectUrl(subject));

    // De-focus the search textbox when an item is selected and hide the
    // handwriting input popover if it's visible
    hwSetVisible(false);
    autocompleteRef.current?.blur();
  }

  /** Navigate to the 'Advanced search' screen with the keyword populated if the
   * user presses enter or clicks the search button, rather than clicking a
   * result directly. */
  function onInputSearch() {
    debug("onInputSearch");

    // Goto the search screen with the query
    gotoSearch(navigate, { query: value.trim() }, true, true);

    // Clear and de-focus the input textbox, and hide the handwriting popover
    setValue("");
    hwSetVisible(false);
    autocompleteRef.current?.blur();
  }

  // Render the autocomplete options when the results change
  const options = useMemo((): AutocompleteOption[] => {
    if (!subjects || !results || !value.trim()) return [];
    debug("rendering results for %s", value);

    const cleanQuery = value.trim();
    const cleanQueryKana = toKana(cleanQuery);

    // Render each search result as an autocomplete option
    const options: AutocompleteOption[] = [];
    for (const result of results) {
      const subject = subjects[result.item.id];
      options.push({
        value: result.item.id.toString(),
        label: <SearchResultEl
          subject={subject}
          query={cleanQuery}
          queryKana={cleanQueryKana}
        />
      });
    }

    return options;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjects, results]);

  return <div className="site-header-search-container">
    <GlobalHotKeys
      keyMap={KEY_MAP}
      handlers={{
        SEARCH: e => {
          e?.preventDefault();
          autocompleteRef.current?.focus();
        },
        SEARCH_WITH_HANDWRITING: e => {
          e?.preventDefault();
          autocompleteRef.current?.focus();
          hwSetVisible(true);
        },
        ADV_SEARCH: e => {
          e?.preventDefault();
          navigate("/search");
        }
      }}
    />

    <Tooltip
      title={disabled ? <>
        Search is disabled while in a session. This can be turned off in Settings.
      </> : undefined}
    >
      <AutoComplete
        // Used to focus the search when the hotkey is received, or de-focus it
        // when a search result is selected
        ref={autocompleteRef}

        // Required to make the dropdown show on an Input.Search:
        popupMatchSelectWidth={true}
        popupClassName={classNames("site-header-search-menu", { "handwriting-input-visible": hwVisible })}
        className="site-header-search"
        value={value}

        disabled={disabled}

        // Always show all options; our search is responsible for providing them
        filterOption={() => true}

        // If the handwriting palette is visible, keep the results open
        open={hwVisible || open}

        onChange={value => setValue(value)}
        onSearch={onAutocomplete}
        onSelect={onSelect}
        onFocus={onFocus}
        onBlur={onBlur}

        options={options}
      >
        <Input.Search
          placeholder={bps.md ? `Search (${ctrl}+K)` : "Search"}
          onSearch={onInputSearch}
          onFocus={onFocus}
          onBlur={onBlur}

          role="searchbox"
          aria-label="Search"

          suffix={hwButton}
        />
      </AutoComplete>
    </Tooltip>

    {/* Deploy the handwriting input popover when it is visible */}
    {hwPopover}
  </div>;
}
