// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useContext, useEffect, useState } from "react";
import { Button, notification } from "antd";

import { ServiceWorkerContext } from "./ServiceWorkerContext.tsx";

export function UpdateCheckNotification(): JSX.Element | null {
  const { needRefresh } = useContext(ServiceWorkerContext);
  const [api, contextHolder] = notification.useNotification();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (needRefresh && !opened) {
      setOpened(true);
      api.info({
        key: "update-check",
        message: "Update available",
        description: <UpdateCheckNotificationInner />,
        duration: 0,
        btn: <UpdateCheckNotificationButton />,
        onClose: close
      });
    } else if (!needRefresh && opened) {
      setOpened(false);
      api.destroy("update-check");
    }
  }, [api, needRefresh, opened]);

  return <>{contextHolder}</>;
}

function UpdateCheckNotificationInner() {
  const { loading } = useContext(ServiceWorkerContext);
  return <p className="my-0">
    An update is available for KanjiSchool. {!loading && "Refresh to update."}
  </p>;
}

function UpdateCheckNotificationButton() {
  const { loading, update } = useContext(ServiceWorkerContext);
  return <Button
    type="primary"
    loading={loading}
    onClick={update}
  >
    Refresh
  </Button>;
}
