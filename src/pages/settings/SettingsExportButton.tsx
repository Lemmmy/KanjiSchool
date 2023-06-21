// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button, notification } from "antd";
import { ExportOutlined } from "@ant-design/icons";

import { SettingsExportFile } from "./ImportExport";

import dayjs from "dayjs";
import { saveAs } from "file-saver";

import { DEFAULT_SETTINGS, AnySettingName, getSettingKey } from "@utils";

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const __GIT_VERSION__: string;
export const gitVersion: string = __GIT_VERSION__;

export function SettingsExportButton(): JSX.Element {
  return <Button
    type="primary"
    icon={<ExportOutlined />}
    onClick={exportSettings}
  >
    Export settings
  </Button>;
}

export function exportSettings(): void {
  // Output object. Partial because it only contains non-default values
  const out: SettingsExportFile = {
    _exportedAt: new Date().toISOString(),
    _version: gitVersion
  };

  let count = 0;

  // Collect all the settings keys from DEFAULT_SETTINGS
  for (const settingName of Object.keys(DEFAULT_SETTINGS) as AnySettingName[]) {
    const stored = localStorage.getItem(getSettingKey(settingName));

    if (stored !== null) {
      out[settingName] = stored;
      count++;
    }
  }

  const outData = JSON.stringify(out);
  const filename = `KanjiSchool-settings-${dayjs().format("YYYY-MM-DD--HH-mm-ss")}.json`;
  const blob = new Blob([outData], { type: "application/json;charset=utf-8" });
  saveAs(blob, filename);

  notification.success({ message: `Exported ${count} settings.` });
}
