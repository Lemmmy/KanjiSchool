// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback } from "react";
import { Tooltip } from "antd";

import { RootState } from "@store";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { gotoSession, startSession } from "@session";
import { PresetDropdownBtn, PresetStartSessionFn } from "@comp/preset-editor";

import { Type, DATA } from "./SummaryMainCol";

import { useBreakpoint } from "@utils";

interface Props {
  type: Type;
}

export function StartSessionButton({ type }: Props): JSX.Element {
  const { button, hotkey } = DATA[type];

  // Change the button size depending on the screen size
  const { sm, md } = useBreakpoint();

  // Disable the button if there is an ongoing session
  const ongoing = useSelector((s: RootState) => s.session.ongoing);

  const history = useHistory();
  const start: PresetStartSessionFn = useCallback(opts =>
    gotoSession(history, startSession(type, undefined, undefined, opts)),
  [history, type]);

  return <PresetDropdownBtn
    className="session-btn"
    type="primary"

    // Shrink and disable the button if there is an ongoing session
    size={(md || !sm) && !ongoing ? "large" : "middle"}
    disabled={ongoing}

    presetType={type}
    start={start}
  >
    <Tooltip title={<>{button} <b>({hotkey})</b></>}>
      {button}
    </Tooltip>
  </PresetDropdownBtn>;
}
