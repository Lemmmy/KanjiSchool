// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Divider } from "antd";
import classNames from "classnames";

import { LookupResults } from "./lookup";
import { ItemsColorBy } from "./types";

import { SubjectGrid } from "@comp/subjects/lists/grid";
import { SubjectRenderTooltipFn } from "@comp/subjects/lists/tooltip/SubjectTooltip";

import { pluralN } from "@utils";

type Props = LookupResults & {
  colorBy: ItemsColorBy;
  hasVocabulary: boolean;
  renderTooltipFn: SubjectRenderTooltipFn;
};

export function ItemsResults({
  colorBy,
  hasVocabulary,
  renderTooltipFn,
  ...r
}: Props): JSX.Element {
  // If there are subgroups, the item count is the sum of all the subgroups'
  // items. Otherwise, it's just the length of items. Can't destructure here
  // because TypeScript isn't clever enough
  const itemCount = r.subgroups
    ? r.items.reduce((sum, subgroup) => sum + subgroup.items.length, 0)
    : r.items.length;

  const classes = classNames("items-results-group", {
    "with-subgroups": r.subgroups
  });

  return <div className={classes}>
    {/* Header */}
    <Divider orientation="left" className="items-results-group-header">
      <span className="header-title">{r.title}</span>
      <span className="header-count">{pluralN(itemCount, "item")}</span>
    </Divider>

    {/* Display a subgroup or the item listing depending */}
    {r.subgroups
      ? (r.items.map(r2 => <ItemsResults
        key={r2.group}
        colorBy={colorBy}
        hasVocabulary={hasVocabulary}
        renderTooltipFn={renderTooltipFn}
        {...r2}
      />))
      : <SubjectGrid
        size="tiny"
        subjectIds={r.itemIds}
        className={"color-by-" + colorBy}
        hasVocabulary={hasVocabulary}
        renderTooltip={renderTooltipFn}
        forceVirtual
      />}
  </div>;
}
