// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect } from "react";
import { Tooltip } from "antd";
import classNames from "classnames";

import { useAppSelector } from "@store";

import { CloudDisconnectedOutlined } from "@comp/icons/CloudDisconnectedOutlined";
import { headerElementClass } from "@layout/nav/AppHeader.tsx";

import { db } from "@db";
import { useAssignments } from "@api";

import { useOnlineStatus, pluralN } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:header-online-status");

export function OnlineStatus(): JSX.Element | null {
  const isOnline = useOnlineStatus();

  // Show nothing if we're online
  if (isOnline) return null;

  // Show the offline icon
  return <Tooltip title="Currently offline. Restore network connectivity to sync assignments.">
    <div
      className={classNames(
        headerElementClass,
        "flex flex-col items-start text-red leading-tight align-middle cursor-default min-w-0",
      )}
    >
      {/* Top row - icon and 'offline' text */}
      <div className="online-status-row flex gap-xs items-center leading-normal">
        <CloudDisconnectedOutlined className="relative top-px" />
        <span className="hidden md:inline online-text text-sm uppercase">Offline</span>
      </div>

      {/* Bottom row - queue size */}
      <OnlineStatusQueueSize />
    </div>
  </Tooltip>;
}

function OnlineStatusQueueSize(): JSX.Element | null {
  // The number of unsubmitted lessons/reviews
  const [queueSize, setQueueSize] = useState(0);

  // Whenever something happens such as the online status changing, the queue
  // being processed, the assignments list changing, or a session ending, count
  // the number of unsubmitted lessons/reviews in the submission queue.
  const processingQueue = useAppSelector(s => s.sync.processingQueue);
  const queueProgress   = useAppSelector(s => s.sync.queueProgress);
  const queueNonce      = useAppSelector(s => s.sync.queueNonce);
  const ongoingSession  = useAppSelector(s => s.session.ongoing);
  const sessionState    = useAppSelector(s => s.session.sessionState);
  const assignments     = useAssignments();

  useEffect(() => {
    debug("recalculating unsubmitted count");
    db.queue.count().then(n => setQueueSize(n));
  }, [processingQueue, queueProgress, queueNonce, ongoingSession, sessionState, assignments]);

  if (queueSize <= 0) return null;

  return <span className="inline-block text-sm text-desc">
    {pluralN(queueSize, "unsubmitted item")}
  </span>;
}
