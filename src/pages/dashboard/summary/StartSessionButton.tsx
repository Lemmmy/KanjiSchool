// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback } from "react";
import { Tooltip } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";

import { useAppSelector } from "@store";
import { useNavigate } from "react-router-dom";

import { gotoSession, startSession } from "@session";
import { PresetDropdownBtn, PresetStartSessionFn } from "@comp/preset-editor";

import { Type, DATA } from "./SummaryMainCol";

interface Props {
  type: Type;
}

export function StartSessionButton({ type }: Props): JSX.Element {
  const { button, hotkey } = DATA[type];

  // Change the button size depending on the screen size
  const { sm, md } = useBreakpoint();

  // Disable the button if there is an ongoing session
  const ongoing = useAppSelector(s => s.session.ongoing);

  const navigate = useNavigate();
  const start: PresetStartSessionFn = useCallback(opts =>
    gotoSession(navigate, startSession(type, undefined, undefined, opts)),
  [navigate, type]);

  return <PresetDropdownBtn
    type="primary"
    className="w-auto"

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
