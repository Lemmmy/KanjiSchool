// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { HotkeyHelpListener } from "./HotkeyHelp";
import { SessionHotkeys } from "./SessionHotkeys";

export function HotkeyServices(): JSX.Element {
  return <>
    <HotkeyHelpListener />
    <SessionHotkeys />
  </>;
}
