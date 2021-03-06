// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApplyTheme, ApplyPalette } from "./theme";
import { SyncHandlers } from "./sync";
import { LastResultsSave } from "./LastResultsSave";
import { HotkeyServices } from "./hotkeys";
import { StudyQueueModal } from "@comp/study-queue/StudyQueueModal";
import { AdvanceTip } from "@pages/dashboard/tips/TipsCard";

export function AppServices(): JSX.Element {
  return <>
    <ApplyTheme />
    <ApplyPalette />
    <SyncHandlers />
    <LastResultsSave />
    <HotkeyServices />
    <StudyQueueModal />
    <AdvanceTip />
  </>;
}
