// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";

import { db } from "@db";

import { AudioContentType } from "@api";
import { fetchSubjectsAudios, getAudioKey } from "../sync/audioFetch";

export async function getStoredAudio(
  subjectId: number,
  voiceActorId: number,
  pronunciation: string
): Promise<[Blob, AudioContentType] | undefined> {
  const key = getAudioKey(subjectId, voiceActorId, pronunciation);

  // If the audio is stored in the database, return it immediately
  let stored = await db.audio.get(key);
  if (stored) return [stored.data, stored.contentType];

  // Otherwise, fetch the audio now. Note that this will occasionally result in
  // double fetches, but the world won't explode
  const subject = store.getState().sync.subjects?.[subjectId];
  if (!subject) throw new Error("No subjects!");

  // Download all necessary audio for the subject
  await fetchSubjectsAudios([subject]);

  // Try to fetch it from the database again
  stored = await db.audio.get(key);
  if (stored) return [stored.data, stored.contentType];
}
