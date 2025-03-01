// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";

import { useAppSelector } from "@store";

import { lsSetBoolean, lsSetObject } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:last-results-save");

// This is jank, but w/e
export function LastResultsSave(): JSX.Element | null {
  const lastResults = useAppSelector(s => s.session.lastResults);
  const lastResultsViewed = useAppSelector(s => s.session.lastResultsViewed);

  useEffect(() => {
    debug("saving lastResults %o lastResultsViewed %o",
      lastResults, lastResultsViewed);

    lsSetObject("sessionLastResults", lastResults);
    lsSetBoolean("sessionLastResultsViewed", lastResultsViewed);
  }, [lastResults, lastResultsViewed]);

  return null;
}
