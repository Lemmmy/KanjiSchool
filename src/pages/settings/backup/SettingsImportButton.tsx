// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { useCallback, useRef } from "react";

import { SettingsExportFile } from "./SettingsBackupButtons.tsx";

import { AnySettingName, DEFAULT_SETTINGS, getSettingKey, lsGetKey, OTHER_LOCAL_STORAGE_SETTING_NAMES } from "@utils";

import { Button } from "@comp/Button";
import { globalNotification } from "@global/AntInterface.tsx";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";
import { CircleArrowOutDownLeft } from "lucide-react";

export function SettingsImportButton(): React.ReactElement {
  const { md } = useBreakpoint();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const onButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files?.[0])
      return;
    const file = files[0];

    // Disallow non-plaintext files
    if (file.type !== "text/plain" && file.type !== "application/json") {
      globalNotification.error({ message: "Invalid file type. " });
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
  }, []);

  const stopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  return <div>
    <span tabIndex={0} role="button" className="inline-block">
      <input
        ref={fileInputRef}
        type="file"
        accept="text/plain,application/json"
        onChange={onFileChange}
        onClick={stopPropagation}
        className="hidden"
      />

      <Button onClick={onButtonClick}>
        <CircleArrowOutDownLeft />{md ? "Import settings" : "Import"}
      </Button>
    </span>
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

    // Other settings (e.g. review presets, fonts)
    for (const lsKey of OTHER_LOCAL_STORAGE_SETTING_NAMES) {
      const stored = data[lsKey];

      if (stored !== undefined) {
        localStorage.setItem(lsGetKey(lsKey), stored);
        count++;
      }
    }

    globalNotification.success({ message: `Import ${count} settings. Site will refresh.` });
    setTimeout(() => { location.reload(); }, 2000);
  } catch (e) {
    console.error(e);
    globalNotification.error({
      message: "Could not import settings, see console for details."
    });
  }
}
