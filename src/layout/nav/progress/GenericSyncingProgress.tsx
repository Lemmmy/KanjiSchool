// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";
import { State } from "@reducers/SyncReducer";

import { SyncProgress } from "@api";
import { HeaderProgress } from "./HeaderProgress";

import { PickByValue } from "utility-types";

interface Props {
  name: string;
  syncingKey: keyof PickByValue<State, boolean>;
  syncProgressKey: keyof PickByValue<State, SyncProgress | undefined>;
}

export function GenericSyncingProgress({
  name,
  syncingKey,
  syncProgressKey
}: Props): JSX.Element | null {
  const syncing = useSelector((s: RootState) => s.sync[syncingKey]);
  const progress = useSelector((s: RootState) => s.sync[syncProgressKey], shallowEqual);
  if (!syncing || !progress || progress.total <= 0) return null;

  return <HeaderProgress
    title={`Syncing ${name}`}
    count={progress.count}
    total={progress.total}
  />;
}
