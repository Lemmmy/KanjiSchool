// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SubjectType } from "@api";
import { SearchOrder, SearchParams, SearchResultItem, SearchResults } from ".";

import { stringifySrsStage, subjectTypeToNumber } from "@utils";
import dayjs, { Dayjs } from "dayjs";
import { groupBy, startCase } from "lodash-es";

export interface SearchResultsGrouped {
  total: number;
  groups: SearchResultGroup[];
}

export interface SearchResultSrsCounts {
  locked: number;
  notStarted: number;
  inProgress: number;
  passed: number;
  burned: number;
}

export interface SearchResultGroup {
  name: string;
  orderBy: any;

  subGroups?: SearchResultGroup[];

  count: number;
  srsCounts: SearchResultSrsCounts;

  items?: SearchResults;
  itemSubjects?: number[];
}

export interface SearchResultGroupPartial extends Pick<SearchResultGroup, "name" | "orderBy"> {
  items: SearchResults;
  itemSubjects: number[];
}

type GroupByFn = (sa: SearchResultItem, now: Dayjs) => [string, number];
const GROUP_BY: Record<Exclude<SearchOrder, "TYPE">, GroupByFn> = {
  LEVEL_THEN_TYPE: ([s]) => ["Level " + s.data.level.toString(), s.data.level],
  NEXT_REVIEW_THEN_TYPE: ([,a], now) => {
    // Group if there's no assignment, the item is locked or burned, etc
    const availableAt = a?.data.available_at;
    if (!availableAt) return ["No review scheduled", -1];

    const available = dayjs(availableAt).startOf("hour");
    const hours = Math.max(-now.diff(available, "hours"), 0);

    // Group if they're available now
    if (hours === 0) return ["Review available now", 0];

    // Group by review hour
    const date = available.format("DD MMM YYYY HH:mm");
    return [date, hours];
  },
  SRS_THEN_TYPE: ([,a]) => {
    const stage = a?.data.srs_stage || 10;
    return [stringifySrsStage(stage), stage];
  }
};

export function groupSearchResults(
  params: SearchParams,
  results: SearchResults
): SearchResultsGrouped {
  // If we only want to group by type, shortcut straight into that
  if (params.sortOrder === "TYPE") {
    const out = groupByType(results);
    const total = out.reduce((sum, group) => sum + group.count, 0);
    return { total, groups: out };
  }

  // Group the items by whatever group comparator the type wants to use
  let total = 0;
  const now = dayjs();
  const comparator = GROUP_BY[params.sortOrder];
  const groupedItems: Record<number, SearchResultGroupPartial> = {};

  for (const item of results) {
    const [name, orderBy] = comparator(item, now);

    if (groupedItems[orderBy]) {
      groupedItems[orderBy].items.push(item);
      groupedItems[orderBy].itemSubjects.push(item[0].id);
    } else {
      groupedItems[orderBy] = {
        name, orderBy,
        items: [item],
        itemSubjects: [item[0].id]
      };
    }
  }

  // For all the groups, now group their items into types, and create the final
  // output group list
  const outGroups: SearchResultGroup[] = [];
  for (const groupOrder in groupedItems) {
    const { name, orderBy, items } = groupedItems[groupOrder];
    const groupedByType = groupByType(items);

    total += items.length;

    outGroups.push({
      name,
      orderBy,

      count: items.length,
      srsCounts: countItemsSrs(items),

      subGroups: groupedByType,
    });
  }

  // Sort by defined order
  outGroups.sort((a, b) => a.orderBy - b.orderBy);

  return { total, groups: outGroups };
}

function groupByType(items: SearchResults): SearchResultGroup[] {
  const groupedItems = groupBy(items, ([s]) => s.object);
  const groups = Object.entries(groupedItems).map(([k, v]) => ({
    name: startCase(k),
    orderBy: subjectTypeToNumber(k as SubjectType),

    count: v.length,
    srsCounts: countItemsSrs(v),

    items: v,
    itemSubjects: v.map(sa => sa[0].id)
  }));

  // Sort by radical/kanji/vocabulary
  groups.sort((a, b) => a.orderBy - b.orderBy);

  return groups;
}

function countItemsSrs(items: SearchResults): SearchResultSrsCounts {
  const out = { locked: 0, notStarted: 0, inProgress: 0, passed: 0, burned: 0 };
  for (const [,a] of items) {
    const stage = a?.data.srs_stage;
    if (stage === undefined) out.locked++;
    else if (stage === 0) out.notStarted++;
    else if (stage >= 1 && stage <= 4) out.inProgress++;
    else if (stage >= 5 && stage <= 8) out.passed++;
    else out.burned++;
  }
  return out;
}
