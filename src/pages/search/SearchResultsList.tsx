// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect, useMemo } from "react";
import { Tag, Collapse } from "antd";
import classNames from "classnames";

import { SearchResultGroup } from "@api";

import { ResultStageCounts } from "./ResultStageCounts";
import { StudyQueueButton } from "@comp/study-queue/StudyQueueButton";

import { SubjectGrid } from "@comp/subjects/lists/grid";
import { VocabList } from "@comp/subjects/lists/vocab";

import { nts } from "@utils";

interface Props {
  groups: SearchResultGroup[];
}

export function SearchResultsList({ groups }: Props): JSX.Element {
  // Active keys for the panel (managed so we can reset them on new results)
  const [activeKeys, setActiveKeys] = useState<string | string[]>();

  // Find all the keys, to auto-open all panels by default.
  const defaultKeys = useMemo(() => (groups.map(g => g.name)), [groups]);
  const hasSubgroups = !!groups?.[0].subGroups;

  // Reset the active keys if the groups change
  useEffect(() => setActiveKeys(defaultKeys), [defaultKeys]);

  // Shared props for all the subject lists
  const elProps: { size: "small"; alignLeft: boolean; innerPadding: number } = {
    size: "small",
    alignLeft: true,
    innerPadding: 16
  };

  const classes = classNames("search-results-list", {
    "nested": hasSubgroups
  });

  return <Collapse
    className={classes}
    activeKey={activeKeys}
    defaultActiveKey={defaultKeys}
    onChange={setActiveKeys}
  >
    {/* Render each result group as a collapse panel */}
    {groups.map(group => (
      <Collapse.Panel
        key={group.name}

        // Header
        header={<div className="search-results-header-main">
          {/* Group name */}
          <h1>{group.name}</h1>

          {/* Total count */}
          <Tag className="total-count-tag">
            {nts(group.count)}
          </Tag>
        </div>}

        // Header extra
        extra={<div className="search-results-extra">
          {/* Counts per SRS stage */}
          <ResultStageCounts counts={group.srsCounts} />
          {/* Add to self-study queue button */}
          {group?.itemSubjects?.length && <StudyQueueButton
            type="primary"
            size="small"
            subjectIds={group.itemSubjects}
          />}
        </div>}
      >
        {/* If there are sub-groups, render those with another list */}
        {group.subGroups && <SearchResultsList groups={group.subGroups} />}

        {/* Display the list items */}
        {group.itemSubjects && group.name === "Radical" &&
          <SubjectGrid {...elProps} subjectIds={group.itemSubjects} />}
        {group.itemSubjects && group.name === "Kanji" &&
          <SubjectGrid {...elProps} subjectIds={group.itemSubjects} />}
        {group.itemSubjects && group.name === "Vocabulary" &&
          <VocabList {...elProps} subjectIds={group.itemSubjects} />}
      </Collapse.Panel>
    ))}
  </Collapse>;
}
