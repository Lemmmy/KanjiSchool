// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SoundOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { booleanSetting, integerSetting, MenuItem, settingsSubGroup } from "../components/SettingsSubGroup.tsx";
import { menuItemClass } from "../components/settingsStyles.ts";

import { AudioStorageUsage } from "./AudioStorageUsage.tsx";

export function getAudioSettingsGroup(): MenuItem {
  return settingsSubGroup(
    "Audio settings",
    <SoundOutlined />,
    [
      booleanSetting("audioMuted", "Mute all auto-playing audio"),
      booleanSetting("audioAutoplayLessons", "Automatically play vocabulary audio in lessons"),
      booleanSetting("audioAutoplayReviews", "Automatically play vocabulary audio in reviews and self-study"),
      integerSetting("audioFetchMax", "Max. # of audio files to download at session start"),
      {
        key: "audioStorageUsage",
        className: classNames(menuItemClass, "!cursor-auto hover:!bg-transparent"),
        label: <AudioStorageUsage />
      }
    ]
  );
}
