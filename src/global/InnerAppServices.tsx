// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SyncHandlers } from "./sync";
import { LastResultsSave } from "./LastResultsSave";
import { HotkeyServices } from "./hotkeys";
import { AdvanceTip } from "@pages/dashboard/tips/TipsCard";

export function InnerAppServices(): JSX.Element {
  return <>
    <SyncHandlers />
    <LastResultsSave />
    <HotkeyServices />
    <AdvanceTip />
  </>;
}
