// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect } from "react";
import { Tooltip } from "antd";

import { RootState } from "@store";
import { useSelector } from "react-redux";

import { CloudDisconnectedOutlined } from "@comp/icons/CloudDisconnectedOutlined";

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
  return <Tooltip
    title="Currently offline. Restore network connectivity to sync assignments."
  >
    <div className="site-header-element site-online-status">
      {/* Top row - icon and 'offline' text */}
      <div className="online-status-row">
        <CloudDisconnectedOutlined />
        <span className="online-text">Offline</span>
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
  const processingQueue = useSelector((s: RootState) => s.sync.processingQueue);
  const queueProgress = useSelector((s: RootState) => s.sync.queueProgress);
  const queueNonce = useSelector((s: RootState) => s.sync.queueNonce);
  const ongoingSession = useSelector((s: RootState) => s.session.ongoing);
  const sessionState = useSelector((s: RootState) => s.session.sessionState);
  const assignments = useAssignments();

  useEffect(() => {
    debug("recalculating unsubmitted count");
    db.queue.count().then(n => setQueueSize(n));
  }, [processingQueue, queueProgress, queueNonce, ongoingSession, sessionState, assignments]);

  if (queueSize <= 0) return null;

  return <span className="online-status-queue-size">
    {pluralN(queueSize, "unsubmitted item")}
  </span>;
}
