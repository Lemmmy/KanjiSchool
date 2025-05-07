// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button } from "@comp/Button";
import { CircleArrowOutUpRight } from "lucide-react";

import { SettingsExportFile } from "./SettingsBackupButtons.tsx";

import dayjs from "dayjs";
import { saveAs } from "file-saver";

import { DEFAULT_SETTINGS, AnySettingName, getSettingKey, OTHER_LOCAL_STORAGE_SETTING_NAMES, lsGetKey } from "@utils";

import { globalNotification } from "@global/AntInterface.tsx";
import useBreakpoint from "antd/es/grid/hooks/useBreakpoint";

const gitVersion: string = import.meta.env.VITE_GIT_VERSION;

export function SettingsExportButton(): React.ReactElement {
  const { md } = useBreakpoint();

  return <Button variant="primary" onClick={exportSettings}>
    <CircleArrowOutUpRight />{md ? "Export settings" : "Export"}
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

  // Other settings (e.g. review presets, fonts)
  for (const lsKey of OTHER_LOCAL_STORAGE_SETTING_NAMES) {
    const stored = localStorage.getItem(lsGetKey(lsKey));

    if (stored !== null) {
      out[lsKey] = stored;
      count++;
    }
  }

  const outData = JSON.stringify(out);
  const filename = `KanjiSchool-settings-${dayjs().format("YYYY-MM-DD--HH-mm-ss")}.json`;
  const blob = new Blob([outData], { type: "application/json;charset=utf-8" });
  saveAs(blob, filename);

  globalNotification.success({ message: `Exported ${count} settings.` });
}
