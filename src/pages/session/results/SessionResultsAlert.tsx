// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, useState } from "react";
import { Collapse } from "antd";

import { RootState } from "@store";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "@actions/SessionActions";

import { HeaderTitle } from "./HeaderTitle";
import { Summary } from "./Summary";
import { useAnswersPanel } from "./AnswersPanel";

import { lsSetBoolean, useBooleanSetting } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:session-results-alert");

const DEFAULT_EXPAND = ["correct", "incorrect"];
const DEFAULT_COLLAPSE: string[] = [];

export function SessionResultsAlert(): JSX.Element | null {
  const dispatch = useDispatch();

  const [showing, setShowing] = useState(false);

  const lastResults = useSelector((s: RootState) => s.session.lastResults);
  const lastResultsViewed = useSelector((s: RootState) => s.session.lastResultsViewed);

  const correct = lastResults?.correctSubjectIds || [];
  const incorrect = lastResults?.incorrectSubjectIds || [];

  const correctAnswersPanel = useAnswersPanel("correct", correct);
  const incorrectAnswersPanel = useAnswersPanel("incorrect", incorrect);

  const expand = useBooleanSetting("dashboardLastSessionExpand");

  useEffect(() => {
    if (lastResultsViewed) return;
    debug("initial mount, not viewed, showing now and setting resultsViewed to true");

    setShowing(true);
    dispatch(actions.setResultsViewed(true));

    // Sync to local storage too
    lsSetBoolean("sessionLastResultsViewed", true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onChange(key: string | string[]) {
    const newShowing = key.includes("1");
    debug("newShowing: %o", newShowing);
    setShowing(newShowing);
  }

  // If there are no results, don't show anything
  if (!lastResults || (correct.length === 0 && incorrect.length === 0))
    return null;

  const total = correct.length + incorrect.length;

  return <Collapse
    className="session-results-alert"
    activeKey={showing ? ["1"] : []}
    ghost
    onChange={onChange}
  >
    <Collapse.Panel
      key="1"
      header={<HeaderTitle {...lastResults} total={total} />}
    >
      <Summary results={lastResults} />

      <Collapse
        className="session-results-answers"
        defaultActiveKey={expand ? DEFAULT_EXPAND : DEFAULT_COLLAPSE}
      >
        {incorrectAnswersPanel}
        {correctAnswersPanel}
      </Collapse>
    </Collapse.Panel>
  </Collapse>;
}
