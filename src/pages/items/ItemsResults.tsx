// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { LookupResults } from "./lookup";
import { ItemsColorBy } from "./types";

import { SubjectGrid } from "@comp/subjects/lists/grid";
import { SubjectRenderTooltipFn } from "@comp/subjects/lists/tooltip/SubjectTooltip";

import { pluralN } from "@utils";
import { StudyQueueButton } from "@comp/study-queue/StudyQueueButton.tsx";
import { useMemo } from "react";
import memoizee from "memoizee";

type Props = LookupResults & {
  colorBy: ItemsColorBy;
  hasVocabulary: boolean;
  renderTooltipFn: SubjectRenderTooltipFn;
  groupNumber: number;
  isSubgroup?: boolean;
  parentTitle?: string;
};

const queueButtonTitles: [string, string] = ["Add all to study queue", "Remove all from study queue"];

function _makeLongTitles(title: string, parentTitle?: string): [string, string] {
  const innerTitle = parentTitle ? `${parentTitle} > ${title}` : title;
  return [
    `Add all items in ${innerTitle} to self-study queue`,
    `Remove all items in ${innerTitle} from self-study queue`
  ];
}
const makeLongTitles = memoizee(_makeLongTitles);

export function ItemsResults({
  colorBy,
  hasVocabulary,
  renderTooltipFn,
  groupNumber,
  isSubgroup,
  parentTitle,
  ...r
}: Props): React.ReactElement {
  // If there are subgroups, the item count is the sum of all the subgroups'
  // items. Otherwise, it's just the length of items. Can't destructure here
  // because TypeScript isn't clever enough
  const itemCount = r.subgroups
    ? r.items.reduce((sum, subgroup) => sum + subgroup.items.length, 0)
    : r.items.length;

  const allSubItems = useMemo(() => r.subgroups
    ? r.items.flatMap(subgroup => subgroup.items.map(i => i[0].id))
    : r.items.map(i => i[0].id),
  [r.subgroups, r.items]);

  const queueButtonLongTitles = makeLongTitles(r.title, parentTitle);

  const classes = classNames(
    "max-w-[1080px] mx-auto",
    {
      "ml-lg": isSubgroup,
    }
  );

  return <div className={classes}>
    {/* Header */}
    <div
      className={classNames(
        "flex items-center h-[27px] gap-md my-md",
        {
          "mb-xs": r.subgroups,
          "font-normal !text-sm": isSubgroup
        }
      )}
    >
      {/* Start line */}
      <Line short subgroup={isSubgroup} />

      {/* Title */}
      <span className={isSubgroup ? "font-normal text-sm" : "font-semibold text-lg"}>
        {r.title}
      </span>

      {/* Count */}
      <span className="text-desc text-sm font-normal">
        {pluralN(itemCount, "item")}
      </span>

      {/* End line */}
      <Line subgroup={isSubgroup} />

      {/* Add to study queue button */}
      {allSubItems.length > 0 && <StudyQueueButton
        variant="link"
        size="small"
        className={classNames(
          "text-desc hover:!text-white/75 light:hover:!text-black/75",
          {
            "opacity-75": isSubgroup,
          }
        )}
        subjectIds={allSubItems}
        titles={queueButtonTitles}
        longTitles={queueButtonLongTitles}
        useShortTitle={isSubgroup}
      />}
    </div>

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
        parentTitle={r.title}
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

interface LineProps {
  short?: boolean;
  subgroup?: boolean;
}

const Line = ({ short, subgroup }: LineProps) => <span
  className={classNames(
    "border-0 border-b border-solid",
    {
      "w-[32px]": short,
      "flex-1": !short,
      "border-b-white/15 light:border-b-black/15": !subgroup,
      "border-b-white/8 light:border-b-black/10": subgroup,
    }
  )}
/>;
