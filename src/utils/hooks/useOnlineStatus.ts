// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect } from "react";

import Debug from "debug";
const debug = Debug("kanjischool:online-status");

export const getOnlineStatus = (): boolean => navigator?.onLine ?? true;

debug("initial online status: %s", getOnlineStatus());
window.addEventListener("online", () => debug("now online"));
window.addEventListener("offline", () => debug("now offline"));

export function useOnlineStatus(): boolean {
  const [onlineStatus, setOnlineStatus] = useState(getOnlineStatus());

  const setOnline = () => setOnlineStatus(true);
  const setOffline = () => setOnlineStatus(false);

  useEffect(() => {
    window.addEventListener("online", setOnline);
    window.addEventListener("offline", setOffline);

    return () => {
      window.removeEventListener("online", setOnline);
      window.removeEventListener("offline", setOffline);
    };
  }, []);

  return onlineStatus;
}
