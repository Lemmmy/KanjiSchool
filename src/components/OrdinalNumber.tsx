// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { nts } from "@utils";

interface Props {
  value: number;
  className?: string;
}

export function getOrdinalSuffix(value: number): string {
  const j = value % 10, k = value % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

export function OrdinalNumber({
  value,
  className
}: Props): JSX.Element {
  const suffix = getOrdinalSuffix(value);
  const classes = classNames("ordinal-number", className);
  return <span className={classes}>
    <span className="ordinal-number-value">{nts(value)}</span>
    <span className="ordinal-number-suffix">{suffix}</span>
  </span>;
}
