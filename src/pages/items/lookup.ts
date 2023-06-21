// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";

import { store } from "@app";
import { SubjectWithAssignment } from "@api";

import {
  FormValues, SORT_BY_FNS, GROUP_BY_FNS, GROUP_BY_TO_NODE_FNS, ItemsBaseType,
  GroupToNodeFn
} from "./types";

import { KanjiJishoData } from "@data";
import { partialRight } from "lodash-es";
import { groupBy, lut, ulut } from "@utils";
import { asc, desc, map, reverse } from "@utils/comparator";

export type LookupResults = ResultGroupSet | ResultSet;

export interface ResultGroupSet {
  subgroups: true;
  group: number;
  title: ReactNode;
  items: ResultSet[];
}

export interface ResultSet {
  subgroups: false;
  group: number;
  title: ReactNode;
  items: SubjectWithAssignment[];
  itemIds: number[];
}

const TYPE_JISHO_MAP: Record<Exclude<ItemsBaseType, "wk">, keyof KanjiJishoData> = {
  "jlpt": "jlpt",
  "joyo": "joyo",
  "freq": "nfr"
};

export function lookupItems(
  type: ItemsBaseType,
  {
    frequencyGroupSize = 500,
    sortBy = "slug", sortByOrder = "asc",
    groupByPrimary, groupByPrimaryOrder = "asc",
    groupBySecondary, groupBySecondaryOrder = "asc",
    types, srsStages
  }: FormValues
): LookupResults[] {
  const { subjects, assignments, subjectAssignmentIdMap } = store.getState().sync;
  if (!subjects || !assignments || !subjectAssignmentIdMap) return [];

  const typeWk = type === "wk";
  const jishoField = type !== "wk" ? TYPE_JISHO_MAP[type] : undefined;

  // Look-up tables for the config options
  const typeLut = ulut(types);
  const srsLut = lut(srsStages.map((s) => parseInt(s)));

  // Filter the subjects
  const filteredSubjects: SubjectWithAssignment[] = [];
  for (const subjectId in subjects) {
    const subject = subjects[subjectId];
    if (subject.data.hidden_at) continue;

    const subjectType = subject.object;

    if (typeWk) {
      // If this subject is not of a desired type, filter it out.
      if (typeLut && !typeLut[subjectType]) continue;
    } else {
      // If we need the Jisho data (non-WK types), filter out any subjects that
      // don't have it.
      const { jisho } = subject.data;
      if (!jisho || subjectType !== "kanji") continue;

      // Ensure the specific Jisho field we need is present, i.e. nonzero
      if (jisho[jishoField!] <= 0) continue;
    }

    // Find the assignment for this subject. If there's no assignment, and we
    // don't want to return "locked" results, then filter it out. Otherwise, use
    // the assignment's SRS stage to determine if it should be filtered out.
    const assignment = assignments[subjectAssignmentIdMap[subjectId] ?? -1];
    if (!assignment && !srsLut[10]) continue; // 10 is locked
    else if (assignment && !srsLut[assignment.data.srs_stage]) continue;

    // Insert a SubjectWithAssignment
    filteredSubjects.push([subject, assignment]);
  }

  // Sort the subjects
  const baseCmp = SORT_BY_FNS[sortBy];
  const cmp = sortByOrder === "asc" ? baseCmp : reverse(baseCmp);
  filteredSubjects.sort(cmp);

  // Output can either be ResultGroupSet or ResultSet
  let out: LookupResults[];

  // Group them the groups are numbered by something that can be sorted after
  const pGroupFn = partialRight(GROUP_BY_FNS[groupByPrimary], frequencyGroupSize);
  const pGroupTitleFn = GROUP_BY_TO_NODE_FNS[groupByPrimary];
  const pGroups: ResultSet[] = groupItems(pGroupFn, pGroupTitleFn,
    frequencyGroupSize, filteredSubjects);

  // Sort the groups by their number asc/desc
  pGroups.sort(map((g) => g.group, groupByPrimaryOrder ? asc : desc));

  // Now apply the secondary grouping if necessary
  if (groupBySecondary !== "none") {
    const sGroupFn = partialRight(GROUP_BY_FNS[groupBySecondary], frequencyGroupSize);
    const sGroupTitleFn = GROUP_BY_TO_NODE_FNS[groupBySecondary];

    out = [];

    // For each primary grouping, turn it into a sub-grouping thingy and group
    // its items again
    for (const pGroup of pGroups) {
      // Group the items by secondary grouping
      const items = pGroup.items;
      const sGroups = groupItems(sGroupFn, sGroupTitleFn,
        frequencyGroupSize, items);

      // Sort the groups by their number asc/desc
      sGroups.sort(map((g) => g.group, groupBySecondaryOrder ? asc : desc));

      // Convert it to a ResultGroupSet
      const newPrGroup = pGroup as unknown as ResultGroupSet;
      newPrGroup.subgroups = true;
      newPrGroup.items = sGroups;

      out.push(newPrGroup);
    }
  } else {
    out = pGroups;
  }

  return out;
}

function groupItems(
  fn: (item: SubjectWithAssignment) => number,
  titleFn: GroupToNodeFn,
  frequencyGroupSize: number,
  filteredSubjects: SubjectWithAssignment[]
): ResultSet[] {
  const grouped = groupBy(filteredSubjects, fn);
  return Object.entries(grouped)
    .map(([n, items]) => ({
      subgroups: false,
      group: Number(n),
      title: titleFn(Number(n), frequencyGroupSize),
      items,
      itemIds: items.map(i => i[0].id)
    }));
}
