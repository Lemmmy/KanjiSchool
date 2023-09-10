// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";

import { HeaderProgress } from "./HeaderProgress";

export function SyncImagesProgress(): JSX.Element | null {
  const syncing  = useAppSelector(s => s.sync.syncingImages);
  const progress = useAppSelector(s => s.sync.imagesProgress, shallowEqual);
  if (!syncing || !progress || progress.count <= 0) return null;

  return <HeaderProgress
    title="Downloading radical images"
    count={progress.count}
    total={progress.total}
  />;
}
