// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useMemo, useCallback, useContext, createContext, FC } from "react";

import { addToStudyQueue, isInStudyQueue, removeFromStudyQueue } from "@session";

import { GlobalHotKeys } from "react-hotkeys";

import Debug from "debug";
const debug = Debug("kanjischool:self-study-queue-hotkey-handler");

const KEY_MAP = {
  QUEUE: ["q"]
};

export type SetCurrentSubjectFn = (subjectId?: number) => void;

interface CtxRes {
  currentSubjectId?: number;
  setCurrentSubject: SetCurrentSubjectFn;
}

export const StudyQueueHotkeyHandlerContext = createContext<CtxRes>({
  setCurrentSubject: () => { /* noop */ }
});

export const StudyQueueHotkeyHandlerProvider: FC = ({ children }) => {
  const [currentSubjectId, setCurrentSubject] = useState<number>();

  const onHotkeyPressed = useCallback(() => {
    if (currentSubjectId === undefined) {
      debug("no subject hovered, ignoring");
      return;
    }

    const inQueue = isInStudyQueue(currentSubjectId);
    debug("inQueue: %o", inQueue);

    if (inQueue) removeFromStudyQueue(currentSubjectId);
    else addToStudyQueue(currentSubjectId);
  }, [currentSubjectId]);

  const res: CtxRes = useMemo(() => ({
    currentSubjectId,
    setCurrentSubject
  }), [currentSubjectId]);

  return <StudyQueueHotkeyHandlerContext.Provider value={res}>
    {children}

    <GlobalHotKeys
      keyMap={KEY_MAP}
      handlers={{ QUEUE: onHotkeyPressed }}
      allowChanges
    />
  </StudyQueueHotkeyHandlerContext.Provider>;
};

export type StudyQueueHoverHookRes = [
  SetCurrentSubjectFn, // set
  () => void, // unset
]

export function useStudyQueueHover(): StudyQueueHoverHookRes {
  const { setCurrentSubject } = useContext(StudyQueueHotkeyHandlerContext);
  const unset = useCallback(() => setCurrentSubject(undefined),
    [setCurrentSubject]);
  return [setCurrentSubject, unset];
}
