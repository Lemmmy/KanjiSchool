// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";
import classNames from "classnames";

interface Props {
  n?: number;
  max?: number;
  className?: string;
}

const TOOLTIP_TITLES: Record<string, string> = {
  "non-level-up": "Non-level-up reviews",
  "level-up": "Level-up reviews (current-level radicals/kanji)",
  "radical": "Radicals",
  "kanji": "Kanji",
  "vocabulary": "Vocabulary"
};

export function HourBar({ n, max, className }: Props): JSX.Element | null {
  if (!n || !max) return null;

  const tooltipTitle = className ? TOOLTIP_TITLES[className] : undefined;

  const classes = classNames("bar-inner", className);

  const bar = <div
    className={classes}
    style={{
      cursor: tooltipTitle ? "pointer" : undefined,
      width: ((n / max) * 100) + "%"
    }}
  />;

  return tooltipTitle
    ? (
      <Tooltip
        title={tooltipTitle}
        destroyTooltipOnHide={false}
      >
        {bar}
      </Tooltip>
    )
    : bar;
}
