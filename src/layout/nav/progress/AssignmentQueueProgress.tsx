// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { HeaderProgress } from "./HeaderProgress";

export function AssignmentQueueProgress(): JSX.Element | null {
  const processing = useSelector((s: RootState) => s.sync.processingQueue);
  const connectionError = useSelector((s: RootState) => s.sync.queueConnectionError);
  const progress = useSelector((s: RootState) => s.sync.queueProgress, shallowEqual);
  if (!processing) return null;

  return <HeaderProgress
    title={connectionError ? "Trying to connect to server" : "Submitting assignments"}
    indeterminate={!progress || !progress.count || !progress.total}
    count={progress?.count ?? 0}
    total={progress?.total ?? 1}
  />;
}
