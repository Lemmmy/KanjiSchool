// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SettingsExportButton } from "./SettingsExportButton";
import { SettingsImportButton } from "./SettingsImportButton";

export function SettingsButtonRow(): JSX.Element {
  return <div className="mx-md my-lg flex gap-md items-center">
    <p className="text-desc text-sm my-0 flex-1">
      Export a copy of your settings to back them up, or import them on another device.
    </p>

    <SettingsExportButton />
    <SettingsImportButton />
  </div>;
}
