// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Action, DevToolsEnhancerOptions } from "@reduxjs/toolkit";

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

export const devToolsOptions: DevToolsEnhancerOptions = {
  actionSanitizer: (action, id) =>
    (actionSanitizers[action.type] as any)?.(action, id) ?? action,

  actionsDenylist: [
    "INIT_SUBJECTS",
    "INIT_ASSIGNMENTS",
    "INIT_REVIEW_STATISTICS"
  ],

  stateSanitizer: (state: any) => ({
    ...state,
    subjects: {
      ...state.subjects,
      subjects: { "note": "Too large." },
      partsOfSpeechCache: { "note": "Too large." },
      slugCache: { "note": "Too large." },
      assignments: { "note": "Too large." },
      reviewStatistics: { "note": "Too large." },
    }
  })
};
