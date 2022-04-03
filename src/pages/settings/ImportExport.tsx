// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE


import { AnySettingName } from "@utils";

export interface SettingsExportFile extends Partial<Record<AnySettingName, string>> {
  _exportedAt: string;
  _version: string;
}

