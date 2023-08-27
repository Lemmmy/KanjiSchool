// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { useNavigate } from "react-router-dom";

import { DataPart } from "./analyze";
import { JlptLevels, JoyoGrades } from "@data";
import { gotoSearch, SearchParamsWithoutOrder } from "@api";

import { nts } from "@utils";

interface Props<T extends number> {
  type: "jlpt" | "joyo";
  title: string;
  keys: [T, string][];
  data?: Record<T, DataPart>;
  totals?: DataPart;
}

const searchKeys: SearchParamsWithoutOrder = {
  subjectTypes: ["kanji"],
  sortOrder: "SRS_THEN_TYPE"
};

export function KanjiProgressTable<T extends number>({
  type,
  title,
  keys,
  data,
  totals
}: Props<T>): JSX.Element | null {
  const navigate = useNavigate();

  if (!data || !totals) return null;

  return <table className="kanji-progress-table">
    <thead>
      <tr>
        <th className="table-corner-title"><b>{title}</b></th>
        <th>Total items</th>
        <th>%</th>
        <th>Locked</th>
        <th>In progress</th>
        <th>Passed</th>
        <th>Burned</th>
      </tr>
    </thead>
    <tbody>
      {/* Individual rows */}
      {keys.map(([k, name]) => {
        const row = data[k];
        if (!row) return null;
        const { percentage, total, locked, inProgress, passed, burned } = row;

        const classes = classNames("clickable", {
          "highlight": percentage === 100,
          "burned": total === burned,
        });

        return <tr
          key={k}
          onClick={() => gotoSearch(
            navigate,
            type === "jlpt"
              ? { ...searchKeys, jlptLevels: [k as JlptLevels] }
              : { ...searchKeys, joyoGrades: [k as JoyoGrades] },
            true,
            true
          )}
          className={classes}
        >
          <td>{name}</td>
          <Td value={total} />
          <td>{percentage.toFixed(0)}%</td>
          <Td value={locked} />
          <Td value={inProgress} />
          <Td value={passed} />
          <Td value={burned} />
        </tr>;
      })}

      {/* Total row */}
      <tr className="total em">
        <td>Total</td>
        <Td value={totals.total} />
        <td>{((totals.percentage / totals.total) * 100).toFixed(0)}%</td>
        <Td value={totals.locked} />
        <Td value={totals.inProgress} />
        <Td value={totals.passed} />
        <Td value={totals.burned} />
      </tr>
    </tbody>
  </table>;
}

function Td({ value = 0 }: { value?: number }): JSX.Element {
  return <td className={value === 0 ? "zero" : ""}>{nts(value)}</td>;
}
