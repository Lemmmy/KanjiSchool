// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";

import { StoredSubject } from "@api";
import { fetchSubjectsAudios } from "./audioFetch";

import { db } from "@db";

import Debug from "debug";
const debug = Debug("kanjischool:api-sync-audio");

export type AudioContentType = "audio/ogg" | "audio/mpeg" | "audio/webm";
export const AUDIO_CONTENT_TYPES: AudioContentType[] =
  ["audio/ogg", "audio/mpeg", "audio/webm"];

export interface StoredAudio {
  key: string; // getAudioKey
  url: string;
  data: Blob;
  contentType: AudioContentType;
}
export type StoredAudioMap = Record<string, StoredAudio>;

export async function getStoredAudioMap(): Promise<StoredAudioMap> {
  const storedAudios = await db.audio.toArray();
  const storedAudioMap: StoredAudioMap = {};
  for (const a of storedAudios) { storedAudioMap[a.key] = a; }
  return storedAudioMap;
}

export type AudioSupport = "NO" | "maybe" | "probably";
export type SupportedAudioTypes = Record<AudioContentType, AudioSupport>;
export function checkSupportedAudioTypes(): SupportedAudioTypes {
  const out = {};
  const audioEl = document.createElement("audio");
  for (const type of AUDIO_CONTENT_TYPES) {
    (out as any)[type] = audioEl.canPlayType(type) || "NO";
  }
  audioEl.remove();
  return out as SupportedAudioTypes;
}

export async function syncAudio(): Promise<void> {
  debug("checking audio sync");

  // Check the compatibility of various audio formats. TODO: Use this data in
  // priority map?
  Object.entries(checkSupportedAudioTypes())
    .forEach(([type, supported]) =>
      debug("%s supported? %s", type, supported));

  // Find the subjects that currently need audio
  const importantSubjects = getImportantAudioSubjects();
  if (importantSubjects.length > 0) {
    debug("%d important audio subjects", importantSubjects.length);

    // Let the fetch queue handle the rest
    await fetchSubjectsAudios(importantSubjects);
    debug("done with syncAudio fetch queue");
  } else {
    debug("no important audio subjects, doing nothing");
  }
}

function getImportantAudioSubjects(): StoredSubject[] {
  const level = store.getState().auth.user?.data.level;
  if (!level) throw new Error("No level!");

  const { subjects } = store.getState().subjects;
  const { assignments, subjectAssignmentIdMap } = store.getState().assignments;
  if (!subjects || !assignments || !subjectAssignmentIdMap) {
    throw new Error("No data yet!");
  }

  // Return only the most important subjects that need audio. For now, this is
  // all subjects on the current level between SRS stages [0, 5).
  const important: StoredSubject[] = [];
  for (const subjectId in subjects) {
    const subject = subjects[subjectId];
    if (subject.object !== "vocabulary" || subject.data.level !== level
      || subject.data.hidden_at) continue;

    const assignment = assignments[subjectAssignmentIdMap[subject.id] ?? -1];
    const srsStage = assignment?.data.srs_stage ?? -1;
    if (srsStage < 0 || srsStage >= 5) continue;

    important.push(subject);
  }

  return important;
}

export interface AudioUsage {
  subjectCount: number;
  count: number;
  bytes: number;
}

/** Estimate the storage used by all the audio in the database. */
export async function getAudioUsage(): Promise<AudioUsage> {
  const subjectIds: Record<string, boolean> = {};
  let count = 0, bytes = 0;

  const storedAudios = await db.audio.toArray();
  for (const audio of storedAudios) {
    count++;
    bytes += audio.data.size;

    // Look-up table for subject IDs (stringified is fine) to get the uniq count
    const [subjectId,] = audio.key.split(" ", 1);
    subjectIds[subjectId] = true;
  }

  const subjectCount = Object.keys(subjectIds).length;
  return { subjectCount, count, bytes };
}

/** Clear all audio from the database, and re-fetch only the important ones */
export async function clearAudio(): Promise<void> {
  debug("clearing audio from database");
  await db.audio.clear();
  await syncAudio();
}
