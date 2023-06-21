// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import { Card } from "antd";

import * as api from "@api";

import { analyze } from "./analyze";
import { KanjiProgressTable } from "./KanjiProgressTable";
import { KanjiProgressLegend } from "./KanjiProgressLegend";

import { JLPT_KEYS, JOYO_KEYS } from "@utils";

export function KanjiProgressCard(): JSX.Element {
  const subjects = api.useSubjects();
  const assignments = api.useAssignments();

  const data = useMemo(() => analyze(subjects, assignments),
    [subjects, assignments]);

  return <Card
    title="Kanji progress"
    className="dashboard-epic-table-card"
    extra={<KanjiProgressLegend />}
  >
    <KanjiProgressTable
      type="joyo"
      title="Jōyō kanji progress"
      keys={JOYO_KEYS}
      data={data?.joyo}
      totals={data?.joyoTotals}
    />
    <KanjiProgressTable
      type="jlpt"
      title="JLPT progress"
      keys={JLPT_KEYS}
      data={data?.jlpt}
      totals={data?.jlptTotals}
    />
  </Card>;
}
