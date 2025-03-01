// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiReview } from "@api";

import { db } from "@db";
import { useLiveQuery } from "dexie-react-hooks";

export const useLastReview = (): ApiReview | undefined =>
  useLiveQuery(() => db.reviews
    .orderBy("data_updated_at").reverse()
    .limit(1)
    .first());
