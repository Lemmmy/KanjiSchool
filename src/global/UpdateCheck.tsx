// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useCallback } from "react";
import { Drawer, Button } from "antd";

import { useRegisterSW } from "virtual:pwa-register/react";

export function UpdateCheck(): JSX.Element | null {
  const {
    offlineReady: [, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onNeedRefresh() {
      setOpen(true);
    },

    onRegisterError(err) {
      console.error(err.message);
    }
  });

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const update = useCallback(() => {
    setLoading(true);
    updateServiceWorker(true).catch(console.error);
  }, [updateServiceWorker]);

  const close = useCallback(() => {
    setOfflineReady(false);
    setNeedRefresh(false);
  }, [setOfflineReady, setNeedRefresh]);

  return needRefresh ? (
    <Drawer
      title="Update available"
      className="update-drawer"
      placement="left"
      maskClosable={false}
      open={open}
      onClose={close}
    >
      <p>An update for the site is available. Please reload.</p>

      <Button type="primary" onClick={update} loading={loading}>
        Reload
      </Button>
    </Drawer>
  ) : null;
}
