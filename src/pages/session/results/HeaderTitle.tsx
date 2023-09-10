// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React from "react";
import { theme } from "antd";
import { SessionType } from "@session";

import dayjs from "dayjs";
import { nts } from "@utils";

const { useToken } = theme;

interface Props {
  type: SessionType;
  completedAt: string;
  total: number;
}

const TYPE_NAMES: Record<SessionType, string> = {
  "lesson": "lesson",
  "review": "review",
  "self_study": "self-study"
};

export const HeaderTitle = React.memo(({ type, completedAt, total }: Props) => {
  const { token } = useToken();

  return <>
    {/* Summary type */}
    <span className="font-medium" style={{ color: token.colorTextHeading, fontSize: token.fontSizeHeading5 }}>
      Last {TYPE_NAMES[type]} summary
    </span>

    {/* X subjects completed at Date */}
    <div className="text-desc text-sm">
      <b>{nts(total)}</b> subject{total !== 1 ? "s" : ""}
      &nbsp;completed at&nbsp;
      <b>{dayjs(completedAt).format("llll")}</b>
    </div>
  </>;
});
