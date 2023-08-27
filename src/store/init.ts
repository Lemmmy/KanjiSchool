// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { getInitialAuthState } from "@reducers/AuthReducer";
import { getInitialSyncState } from "@reducers/SyncReducer";
import { getInitialSessionState } from "@reducers/SessionReducer";
import { getInitialSettingsState } from "@reducers/SettingsReducer";

import { Action, createStore, Store } from "redux";
import { composeWithDevTools } from "@redux-devtools/extension";
import rootReducer from "./reducers/RootReducer";

import { RootState, RootAction } from "./index";

import Debug from "debug";
const debug = Debug("kanjischool:store");

export const actionSanitizers: Record<string, (action: Action, id: number) => Action> = {
  "INIT_SUBJECTS": action => ({
    ...action,
    subjectMap: { "note": "Too large." },
    partsOfSpeechCache: { "note": "Too large." },
    slugCache: { "note": "Too large." },
  }),
  "INIT_ASSIGNMENTS": action => ({ type: action.type, "note": "Too large." }),
  "INIT_REVIEW_STATISTICS": action => ({ type: action.type, "note": "Too large." })
};

const composeEnhancers = composeWithDevTools({
  actionSanitizer: (action, id) =>
    (actionSanitizers[action.type] as any)?.(action, id) ?? action,
  actionsDenylist: [
    "INIT_SUBJECTS", "INIT_ASSIGNMENTS", "INIT_REVIEW_STATISTICS",
    "SET_SYNCING_IMAGES_PROGRESS", "SET_SYNCING_AUDIO_PROGRESS"
  ],
  stateSanitizer: (state: any) => ({
    ...state,
    sync: {
      ...(state as any).sync,
      subjects: { "note": "Too large." },
      partsOfSpeechCache: { "note": "Too large." },
      slugCache: { "note": "Too large." },
      assignments: { "note": "Too large." },
      reviewStatistics: { "note": "Too large." },
    }
  })
});

export const initStore = (): Store<RootState, RootAction> => {
  debug("initializing redux store");
  return createStore(
    rootReducer,
    {
      auth: getInitialAuthState(),
      sync: getInitialSyncState(),
      session: getInitialSessionState(),
      settings: getInitialSettingsState(),
    },
    composeEnhancers()
  );
};
