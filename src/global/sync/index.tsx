// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React from "react";

import { SyncSubjects } from "./SyncSubjects";
import { SyncAssignments } from "./SyncAssignments";
import { SyncAudio } from "./SyncAudio";
import { SyncImages } from "./SyncImages";
import { SyncLevelProgressions } from "./SyncLevelProgressions";
import { SyncWhenOnline } from "./SyncWhenOnline";
import { UpdateStreak } from "./UpdateStreak";

import Debug from "debug";
const debug = Debug("kanjischool:sync-handlers");

/**
 * SyncHandlers contains all the online syncing handlers for online WK data,
 * such as the user, subjects, and assignments.
 */
export const SyncHandlers = React.memo(() => {
  debug("SyncHandlers reporting for duty");

  return <>
    <SyncSubjects />
    <SyncAssignments />
    <SyncAudio />
    <SyncImages />
    <SyncLevelProgressions />
    <SyncWhenOnline />
    <UpdateStreak />
  </>;
});
