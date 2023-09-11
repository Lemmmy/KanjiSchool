// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useEffect, useMemo, useState } from "react";
import { Collapse, CollapseProps } from "antd";

import { useAppSelector } from "@store";
import { useDispatch } from "react-redux";
import { setResultsViewed } from "@store/slices/sessionSlice.ts";

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

  const lastResults = useAppSelector(s => s.session.lastResults);
  const lastResultsViewed = useAppSelector(s => s.session.lastResultsViewed);

  const correct = lastResults?.correctSubjectIds || [];
  const incorrect = lastResults?.incorrectSubjectIds || [];

  const correctAnswersPanel = useAnswersPanel("correct", correct);
  const incorrectAnswersPanel = useAnswersPanel("incorrect", incorrect);

  const expand = useBooleanSetting("dashboardLastSessionExpand");

  useEffect(() => {
    if (lastResultsViewed) return;
    debug("initial mount, not viewed, showing now and setting resultsViewed to true");

    setShowing(true);
    dispatch(setResultsViewed(true));

    // Sync to local storage too
    lsSetBoolean("sessionLastResultsViewed", true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = useCallback((key: string | string[]) => {
    const newShowing = key.includes("1");
    debug("newShowing: %o", newShowing);
    setShowing(newShowing);
  }, []);

  const total = correct.length + incorrect.length;

  const rootItems: CollapseProps["items"] = useMemo(() => {
    // If there are no results, don't show anything
    if (!lastResults || total === 0) return [];

    const subItems: CollapseProps["items"] = [
      correctAnswersPanel,
      incorrectAnswersPanel
    ].filter(p => p !== null) as CollapseProps["items"];

    return [{
      key: "1",
      className: "rounded-none [&>.ant-collapse-header]:!rounded-none",
      label: <HeaderTitle {...lastResults} total={total} />,
      children: <>
        <Summary results={lastResults} />

        <Collapse
          className="mt-lg"
          defaultActiveKey={expand ? DEFAULT_EXPAND : DEFAULT_COLLAPSE}
          items={subItems}
        />
      </>
    }];
  }, [lastResults, total, correctAnswersPanel, incorrectAnswersPanel, expand]);

  if (!rootItems.length) return null;

  return <Collapse
    className="[&_.ant-collapse-item]:bg-container [.light_&_.ant-collapse-item]:bg-[#e9e9e9]"
    activeKey={showing ? ["1"] : []}
    ghost
    onChange={onChange}
    items={rootItems}
  />;
}
