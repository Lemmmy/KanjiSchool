// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, useState } from "react";
import { notification } from "antd";

import { useOnlineStatus } from "@utils";

import { syncPartial } from "@api";

import Debug from "debug";
const debug = Debug("kanjischool:sync-when-online-global");

/**
 * SyncWhenOnline is responsible for syncing all data when network connection is
 * restored.
 */
export function SyncWhenOnline(): JSX.Element | null {
  const [lastOnline, setLastOnline] = useState<boolean>();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    debug("checking SyncWhenOnline %s %s", lastOnline, isOnline);

    if (!lastOnline && isOnline) {
      // On first startup, lastOnline starts as 'undefined', so if we are
      // actually online the whole time, don't show the notification, but still
      // sync.
      if (lastOnline === false) {
        debug("online status false --> true; syncing partial");
        notification.success({
          message: "Network connection restored",
          description: "Now syncing assignments."
        });
      } else {
        debug("online status was likely actually true to begin with");
      }

      syncPartial();
    }

    setLastOnline(isOnline);
  }, [lastOnline, isOnline]);

  return null;
}
