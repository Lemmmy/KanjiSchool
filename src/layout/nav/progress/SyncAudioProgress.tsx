// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { HeaderProgress } from "./HeaderProgress";

export function SyncAudioProgress(): JSX.Element | null {
  const syncing = useSelector((s: RootState) => s.sync.syncingAudio);
  const progress = useSelector((s: RootState) => s.sync.audioProgress, shallowEqual);
  if (!syncing || !progress || progress.count <= 0) return null;

  return <HeaderProgress
    title="Downloading vocabulary audio"
    count={progress.count}
    total={progress.total}
  />;
}
