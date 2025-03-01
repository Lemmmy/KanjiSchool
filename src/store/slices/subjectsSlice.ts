// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PartsOfSpeechCache, SlugCache, StoredSubjectMap } from "@api";

export interface SubjectsSliceState {
  readonly subjects?: StoredSubjectMap;
  readonly partsOfSpeechCache?: PartsOfSpeechCache;
  readonly slugCache?: SlugCache;
}

const initialState = (): SubjectsSliceState => ({
  subjects: undefined,
  partsOfSpeechCache: undefined,
  slugCache: undefined,
});

interface InitSubjectsPayload {
  subjectMap: StoredSubjectMap;
  partsOfSpeechCache: PartsOfSpeechCache;
  slugCache: SlugCache;
}

const subjectsSlice = createSlice({
  name: "subjects",
  initialState,
  reducers: {
    initSubjects(s, { payload }: PayloadAction<InitSubjectsPayload>) {
      const { subjectMap, partsOfSpeechCache, slugCache } = payload;
      s.subjects = subjectMap;
      s.partsOfSpeechCache = partsOfSpeechCache;
      s.slugCache = slugCache;
    },
  }
});

export const { initSubjects } = subjectsSlice.actions;

export default subjectsSlice.reducer;
