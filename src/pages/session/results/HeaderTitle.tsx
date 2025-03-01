// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { useCallback } from "react";
import { theme, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";

import { useDispatch } from "react-redux";
import { clearLastResults } from "@store/slices/sessionSlice.ts";

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
  const dispatch = useDispatch();

  const clear = useCallback(() => {
    dispatch(clearLastResults()); // LastResultSave will save this to local storage
  }, [dispatch]);

  return <>
    {/* Close button */}
    <Tooltip title={`Clear last ${TYPE_NAMES[type]} summary`} placement="bottom">
      <div
        className="float-right w-[48px] h-[48px] rounded flex items-center justify-center
          hover:bg-white/5 light:hover:bg-black/5"
        onClick={clear}
      >
        <CloseOutlined className="text-desc" />
      </div>
    </Tooltip>

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
