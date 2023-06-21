// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React from "react";
import { notification } from "antd";
import { ImportOutlined } from "@ant-design/icons";

import { SettingsExportFile } from "./ImportExport";

import { AnySettingName, DEFAULT_SETTINGS, getSettingKey } from "@utils";

export function SettingsImportButton(): JSX.Element {
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;
    if (!files?.[0])
      return;
    const file = files[0];

    // Disallow non-plaintext files
    if (file.type !== "text/plain" && file.type !== "application/json") {
      notification.error({ message: "Invalid file type. " });
      return;
    }

    // Read and parse the file
    const reader = new FileReader();
    reader.readAsText(file, "UTF-8");
    reader.onload = e => {
      if (!e.target || !e.target.result)
        return;
      const contents = e.target.result.toString();
      importSettings(contents);
    };
  }

  return <div>
    {/* Pretend to be an ant-design button */}
    <label htmlFor="import-settings-file" className="ant-btn">
      <ImportOutlined /><span>Import settings</span>
    </label>

    <input
      id="import-settings-file"
      type="file"
      accept="text/plain,application/json"
      onChange={onFileChange}
      style={{ display: "none" }} />
  </div>;
}

export function importSettings(contents: string): void {
  try {
    const data: SettingsExportFile = JSON.parse(contents);
    if (!data._version || !data._exportedAt)
      throw new Error("Invalid export file");

    let count = 0;

    // Collect all the settings keys from DEFAULT_SETTINGS. If they exist in
    // the settings file, import them
    for (const settingName of Object.keys(DEFAULT_SETTINGS) as AnySettingName[]) {
      const stored = data[settingName];

      if (stored !== undefined) {
        localStorage.setItem(getSettingKey(settingName), stored);
        count++;
      }
    }

    notification.success({ message: `Import ${count} settings. Site will refresh.` });
    setTimeout(() => { location.reload(); }, 2000);
  } catch (e) {
    console.error(e);
    notification.error({
      message: "Could not import settings, see console for details."
    });
  }
}
