// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { PageLayout } from "@layout/PageLayout";

import { SettingsBackupButtons } from "./backup/SettingsBackupButtons.tsx";
import { SettingsUserInfo } from "./SettingsUserInfo.tsx";
import { SettingsMenu } from "@pages/settings/SettingsMenu.tsx";

function SettingsPage(): JSX.Element {
  return <PageLayout
    contentsClassName="max-w-[960px] mx-auto md:pt-md"
    headerClassName="max-w-[960px] mx-auto"
    siteTitle="Settings"
    title="Settings"
  >
    {/* User info */}
    <SettingsUserInfo />

    {/* Import/export buttons */}
    <SettingsBackupButtons />

    {/* Main settings menu */}
    <SettingsMenu />

    {/* Page contents margin/spacer */}
    <div className="h-lg" />
  </PageLayout>;
}

export const Component = SettingsPage;
