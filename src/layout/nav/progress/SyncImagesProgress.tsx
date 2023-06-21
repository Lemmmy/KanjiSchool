// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { HeaderProgress } from "./HeaderProgress";

export function SyncImagesProgress(): JSX.Element | null {
  const syncing = useSelector((s: RootState) => s.sync.syncingImages);
  const progress = useSelector((s: RootState) => s.sync.imagesProgress, shallowEqual);
  if (!syncing || !progress || progress.count <= 0) return null;

  return <HeaderProgress
    title="Downloading radical images"
    count={progress.count}
    total={progress.total}
  />;
}
