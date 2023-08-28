// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";

import { getApplicationKeyMap } from "react-hotkeys";
import { ctrl } from "@utils";

interface Props {
  shortcut: string;
  ifGroup?: string;
}

export function MenuHotkey({
  shortcut,
  ifGroup
}: Props): JSX.Element | null {
  const keyMap = getApplicationKeyMap();
  const shouldHide = useMemo(() => {
    if (!ifGroup) return false;

    // Only show if there is at least one key matching ifGroup currently mounted
    for (const action in keyMap) {
      const key = keyMap[action];
      if (key.group === ifGroup) return false;
    }

    return true;
  }, [keyMap, ifGroup]);

  if (shouldHide) return null;

  return <span
    className="ml-md -mr-xs text-desc text-xs float-right leading-[24px] align-middle px-2 bg-black/20 rounded-sm"
  >
    {shortcut.replace("Ctrl", ctrl)}
  </span>;
}
