// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useAppSelector } from "@store";
import { shallowEqual } from "react-redux";
import { SyncSliceState } from "@store/slices/syncSlice.ts";

import { SyncProgress } from "@api";
import { HeaderProgress } from "./HeaderProgress";

import { PickByValue } from "utility-types";

interface Props {
  name: string;
  syncingKey: keyof PickByValue<SyncSliceState, boolean>;
  syncProgressKey: keyof PickByValue<SyncSliceState, SyncProgress | undefined>;
}

export function GenericSyncingProgress({
  name,
  syncingKey,
  syncProgressKey
}: Props): React.ReactElement | null {
  const syncing  = useAppSelector(s => s.sync[syncingKey]);
  const progress = useAppSelector(s => s.sync[syncProgressKey], shallowEqual);
  if (!syncing || !progress || progress.total <= 0) return null;

  return <HeaderProgress
    title={`Syncing ${name}`}
    count={progress.count}
    total={progress.total}
  />;
}
