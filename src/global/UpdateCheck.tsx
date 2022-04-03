// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect } from "react";
import { Drawer, Button } from "antd";

import * as serviceWorker from "@utils/setup/serviceWorkerRegistration";
import { isLocalhost } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:service-worker-check");

export function UpdateCheck(): JSX.Element | null {
  const [showReload, setShowReload] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);

  function onUpdate(registration: ServiceWorkerRegistration) {
    setShowReload(true);
    setDrawerVisible(true);
    setWaitingWorker(registration.waiting);
  }

  /** Force the service worker to update, wait for it to become active, then
   * reload the page. */
  function reloadPage() {
    setLoading(true);
    debug("emitting skipWaiting now");

    waitingWorker?.postMessage({ type: "SKIP_WAITING" });

    waitingWorker?.addEventListener("statechange", () => {
      debug("SW state changed to %s", waitingWorker?.state);

      if (waitingWorker?.state === "activated") {
        debug("reloading now!");
        window.location.reload();
      }
    });
  }

  // NOTE: The update checker is also responsible for registering the service
  //       worker in the first place.
  useEffect(() => {
    debug("registering service worker");
    serviceWorker.register({ onUpdate });
  }, []);

  // Always show the dialog on localhost if a thing is set
  useEffect(() => {
    if (isLocalhost && localStorage.getItem("su") === "true") {
      setShowReload(true);
      setDrawerVisible(true);
    }
  }, []);

  return showReload ? (
    <Drawer
      title="Update available"
      className="update-drawer"
      placement="left"
      maskClosable={false}
      visible={drawerVisible}
      onClose={() => setDrawerVisible(false)}
    >
      <p>An update for the site is available. Please reload.</p>

      <Button type="primary" onClick={reloadPage} loading={loading}>
        Reload
      </Button>
    </Drawer>
  ) : null;
}
