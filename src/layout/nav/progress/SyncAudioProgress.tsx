// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import { HeaderProgress } from "./HeaderProgress";

export function SyncAudioProgress(): React.ReactElement | null {
  const syncing  = useAppSelector(s => s.sync.syncingAudio);
  const progress = useAppSelector(s => s.sync.audioProgress, shallowEqual);
  if (!syncing || !progress || progress.count <= 0) return null;

  return <HeaderProgress
    title="Downloading vocabulary audio"
    count={progress.count}
    total={progress.total}
  />;
}
