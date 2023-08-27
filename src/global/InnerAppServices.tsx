// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SyncHandlers } from "./sync";
import { LastResultsSave } from "./LastResultsSave";
import { HotkeyServices } from "./hotkeys";
import { StudyQueueModal } from "@comp/study-queue/StudyQueueModal";
import { AdvanceTip } from "@pages/dashboard/tips/TipsCard";

export function InnerAppServices(): JSX.Element {
  return <>
    <SyncHandlers />
    <LastResultsSave />
    <HotkeyServices />
    <StudyQueueModal />
    <AdvanceTip />
  </>;
}
