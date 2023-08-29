// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";
import classNames from "classnames";

type HourBarType = "non-level-up" | "level-up" | "radical" | "kanji" | "vocabulary";

interface Props {
  n?: number;
  max?: number;
  type?: HourBarType;
  bgClassName?: string;
}

const TOOLTIP_TITLES: Record<HourBarType, string> = {
  "non-level-up": "Non-level-up reviews",
  "level-up": "Level-up reviews (current-level radicals/kanji)",
  "radical": "Radicals",
  "kanji": "Kanji",
  "vocabulary": "Vocabulary"
};

export function HourBar({
  n,
  max,
  type,
  bgClassName = "bg-primary"
}: Props): JSX.Element | null {
  if (!n || !max) return null;

  const tooltipTitle = type ? TOOLTIP_TITLES[type] : undefined;

  const classes = classNames("inline-block h-[12.8px] last:rounded-r-[6.4px]", bgClassName);

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
