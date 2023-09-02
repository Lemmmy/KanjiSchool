// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { useState, useCallback, useContext, createContext, ReactNode, lazy, Suspense } from "react";

import { PresetType } from ".";
import { FullscreenSpin } from "@utils/FullscreenSpin.tsx";

export type OpenFn = (type: PresetType) => void;
export const PresetModalContext = createContext<OpenFn>(() => { /* expected empty function */ });

interface ModalProps {
  type: PresetType;
  visible: boolean;
  loaded?: boolean;
}

const PresetEditorModal = lazy(() => import("./PresetEditorModal.tsx"));

export const PresetModalProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [modalProps, setModalProps] = useState<Omit<ModalProps, "closeFn">>({
    type: "lesson",
    visible: false,
    loaded: false
  });

  const openFn = useCallback((type: PresetType) => {
    setModalProps(p => ({ ...p, type, visible: true, loaded: true }));
  }, []);

  const closeFn = useCallback(() => {
    setModalProps(p => ({ ...p, visible: false }));
  }, []);

  return <PresetModalContext.Provider value={openFn}>
    {children}

    {modalProps.loaded && <Suspense fallback={<FullscreenSpin />}>
      <PresetEditorModal closeFn={closeFn} {...modalProps} />
    </Suspense>}
  </PresetModalContext.Provider>;
};

export function usePresetModal(): [OpenFn] {
  const openFn = useContext(PresetModalContext);
  return [openFn];
}
