// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect, useMemo } from "react";
import { Tag, Collapse, CollapseProps } from "antd";
import classNames from "classnames";

import { SearchResultGroup } from "@api";

import { ResultStageCounts } from "./ResultStageCounts";
import { StudyQueueButton } from "@comp/study-queue/StudyQueueButton";

import { SubjectGrid } from "@comp/subjects/lists/grid";
import { VocabList } from "@comp/subjects/lists/vocab";

import { nts } from "@utils";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

interface Props {
  groups: SearchResultGroup[];
  isNested?: boolean;
}

// Shared props for all the subject lists
const elProps = {
  size: "small",
  alignLeft: false,
  innerPadding: 16,
} as const;

export function SearchResultsList({ groups, isNested }: Props): React.ReactElement {
  // Active keys for the panel (managed so we can reset them on new results)
  const [activeKeys, setActiveKeys] = useState<string | string[]>();

  const { sm } = useBreakpoint();

  // Find all the keys, to auto-open all panels by default.
  const defaultKeys = useMemo(() => (groups.map(g => g.name)), [groups]);
  const hasSubgroups = !!groups?.[0].subGroups;

  // Reset the active keys if the groups change
  useEffect(() => setActiveKeys(defaultKeys), [defaultKeys]);

  const items: CollapseProps["items"] = useMemo(() => {
    return groups.map(group => ({
      key: group.name,

      label: <CollapseHeader group={group} />,
      extra: <CollapseHeaderExtra group={group} useShortTitle={!sm} />,

      children: <>
        {/* If there are subgroups, render those with another list */}
        {group.subGroups && <SearchResultsList
          groups={group.subGroups}
          isNested
        />}

        {/* Display the list items */}
        {group.itemSubjects && group.name === "Radical" &&
          <SubjectGrid {...elProps} subjectIds={group.itemSubjects} />}
        {group.itemSubjects && group.name === "Kanji" &&
          <SubjectGrid {...elProps} subjectIds={group.itemSubjects} />}
        {group.itemSubjects && group.name === "Vocabulary" &&
          <VocabList {...elProps} subjectIds={group.itemSubjects} />}
      </>
    }));
  }, [groups, sm]);

  const classes = classNames(
    "max-w-[920px] mx-auto my-lg",
    "[&_.ant-collapse-header]:!items-center",
    {
      "!my-0": isNested,
      "[&_.ant-collapse-content-box]:!p-md": hasSubgroups && !isNested,
      "[&_.ant-collapse-content-box]:!p-0": !hasSubgroups || isNested,
    }
  );

  return <Collapse
    className={classes}
    activeKey={activeKeys}
    defaultActiveKey={defaultKeys}
    onChange={setActiveKeys}
    items={items}
  />;
}

function CollapseHeader({ group: { count, name } }: { group: SearchResultGroup }) {
  return <div className="inline-flex items-center">
    {/* Group name */}
    <h2 className="font-medium my-0">{name}</h2>

    {/* Total count */}
    <Tag className="mt-px ml-xs text-sm font-normal">
      {nts(count)}
    </Tag>
  </div>;
}

function CollapseHeaderExtra({ group: { itemSubjects, srsCounts }, useShortTitle }: { group: SearchResultGroup; useShortTitle?: boolean }) {
  return <div className="flex flex-col items-end justify-center">
    {/* Counts per SRS stage */}
    <ResultStageCounts counts={srsCounts} />

    {/* Add to self-study queue button */}
    {itemSubjects?.length && <StudyQueueButton
      useShortTitle={useShortTitle}
      type="primary"
      size="small"
      subjectIds={itemSubjects}
    />}
  </div>;
}
