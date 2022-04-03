// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useCallback, useContext, createContext, FC } from "react";

import { PresetEditorModal, PresetType } from ".";

export type OpenFn = (type: PresetType) => void;
export const PresetModalContext = createContext<OpenFn>(() => { /* expected empty function */});

interface ModalProps {
  type: PresetType;
  visible: boolean;
}

export const PresetModalProvider: FC = ({ children }) => {
  const [modalProps, setModalProps] = useState<Omit<ModalProps, "closeFn">>({ type: "lesson", visible: false });
  const openFn = useCallback((type: PresetType) => setModalProps({ type, visible: true }), []);
  const closeFn = useCallback(() => setModalProps(p => ({ type: p.type, visible: false })), []);

  return <PresetModalContext.Provider value={openFn}>
    {children}

    <PresetEditorModal closeFn={closeFn} {...modalProps} />
  </PresetModalContext.Provider>;
};

export function usePresetModal(): [OpenFn] {
  const openFn = useContext(PresetModalContext);
  return [openFn];
}
