// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { AnySettingName } from "@utils";

import { SettingsExportButton } from "./SettingsExportButton.tsx";
import { SettingsImportButton } from "./SettingsImportButton.tsx";

export interface SettingsExportFile extends Partial<Record<AnySettingName, string>> {
  _exportedAt: string;
  _version: string;
}

export function SettingsBackupButtons(): JSX.Element {
  return <div className="mx-md my-lg flex flex-col md:flex-row gap-md items-center">
    <p className="text-desc text-sm my-0 flex-1">
      Export a copy of your settings to back them up, or import them on another device.
    </p>

    <SettingsExportButton />
    <SettingsImportButton />
  </div>;
}
