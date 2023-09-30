// Copyright (c) 2021-2023 Drew Edwards
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
  groupNumber: number;
  isSubgroup?: boolean;
};

export function ItemsResults({
  colorBy,
  hasVocabulary,
  renderTooltipFn,
  groupNumber,
  isSubgroup,
  ...r
}: Props): JSX.Element {
  // If there are subgroups, the item count is the sum of all the subgroups'
  // items. Otherwise, it's just the length of items. Can't destructure here
  // because TypeScript isn't clever enough
  const itemCount = r.subgroups
    ? r.items.reduce((sum, subgroup) => sum + subgroup.items.length, 0)
    : r.items.length;

  const classes = classNames(
    "max-w-[1080px] mx-auto",
    {
      "ml-lg": isSubgroup,
    }
  );

  return <div className={classes}>
    {/* Header */}
    <Divider
      orientation="left"
      className={classNames(
        "before:!w-[32px] before:!translate-y-px after:!translate-y-px", // 50% y makes the divider 2px thick, yuck
        {
          "mb-xs": r.subgroups,
          ["font-normal !text-sm !border-bs-white/8 !border-be-white/8 " +
            "light:!border-bs-black/10 light:!border-be-black/10"]: isSubgroup
        }
      )}
    >
      {/* Title */}
      <span className="mr-[1em]">
        {r.title}
      </span>

      {/* Count */}
      <span className="text-desc text-sm font-normal">
        {pluralN(itemCount, "item")}
      </span>
    </Divider>

    {/* Display a subgroup or the item listing depending */}
    {r.subgroups
      ? (r.items.map(r2 => <ItemsResults
        key={r2.group}
        colorBy={colorBy}
        hasVocabulary={hasVocabulary}
        renderTooltipFn={renderTooltipFn}
        groupNumber={r2.group}
        {...r2}
        isSubgroup
      />))
      : <SubjectGrid
        size="tiny"
        subjectIds={r.itemIds}
        colorBy={colorBy}
        hasVocabulary={hasVocabulary}
        renderTooltip={renderTooltipFn}
        forceVirtual
        alignLeft
      />}
  </div>;
}
