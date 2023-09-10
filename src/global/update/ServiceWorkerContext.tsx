// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useCallback, ReactNode, useMemo, createContext } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

interface ServiceWorkerContextRes {
  loading    : boolean;
  needRefresh: boolean;
  update     : () => void;
  close      : () => void;
}
export const ServiceWorkerContext = createContext<ServiceWorkerContextRes>({
  loading    : false,
  needRefresh: false,
  update     : () => {},
  close      : () => {}
});

export function ServiceWorkerContextProvider({ children }: { children: ReactNode }): JSX.Element | null {
  const {
    offlineReady: [, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisterError(err) {
      console.error(err.message);
    }
  });

  const [loading, setLoading] = useState(false);

  const update = useCallback(() => {
    setLoading(true);
    updateServiceWorker(true).catch(console.error);
  }, [updateServiceWorker]);

  const close = useCallback(() => {
    setOfflineReady(false);
    setNeedRefresh(false);
  }, [setOfflineReady, setNeedRefresh]);

  const res: ServiceWorkerContextRes = useMemo(() => ({
    loading,
    needRefresh,
    update,
    close
  }), [loading, needRefresh, update, close]);

  console.log("ServiceWorkerContextProvider4", res);

  return <ServiceWorkerContext.Provider value={res}>
    {children}
  </ServiceWorkerContext.Provider>;
}
