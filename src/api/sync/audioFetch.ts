// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@app";
import * as actions from "@actions/SyncActions";

import {
  AudioContentType, getStoredAudioMap, StoredAudio, StoredSubject
} from "@api";
import { db } from "@db";

import { getIntegerSetting, lsGetNumber, lsSetNumber } from "@utils";
import { asc, map as cmpMap } from "@utils/comparator";

import { globalNotification } from "@global/AntInterface.tsx";

import { groupBy, mapValues } from "lodash-es";
import PQueue from "p-queue";

import Debug from "debug";
const debug = Debug("kanjischool:api-audio-fetch");

const PARALLEL_AUDIO_TASKS = 8;
const audioFetchQueue = new PQueue({
  concurrency: PARALLEL_AUDIO_TASKS
});

// Turns out Ogg (container) and Vorbis (codec) are still fairly unsupported
// by browsers; Safari does not support Vorbis and pre-Chromium Edge does not
// support Ogg. Meanwhile, all major browsers support WebM and MP3. This change
// in audio download priorities will have to result in a re-download of all
// audio though (2021-11-20).
const FORMAT_PRIORITY: Record<AudioContentType, number> = {
  "audio/webm": 0,
  "audio/mpeg": 1,
  "audio/ogg": 2
};

export interface AudioFetchTask {
  subjectId: number;
  actor: number;
  pronunciation: string;
  url: string;
  contentType: AudioContentType;
}

export function getAudioKey(
  subjectId: number | string,
  voiceActorId: number | string,
  pronunciation: string
): string {
  return `${subjectId} ${voiceActorId} ${pronunciation}`;
}

export async function fetchSubjectsAudios(
  subjects: StoredSubject[],
  honorMax = false
): Promise<StoredAudio[]> {
  if (!subjects.length) return [];

  // If the stored version is not the same as the current version, remove all
  // existing vocabulary audio from the database before downloading these new
  // ones.
  const syncCurrentVersion = 2;
  const syncLastVersion = lsGetNumber("audioFetchLastVersion", 0);
  debug("audio dl ver %d -> %d", syncLastVersion, syncCurrentVersion);
  if (syncLastVersion !== syncCurrentVersion) {
    debug("outdated audio dl, nuking audio db");
    await db.audio.clear();
  }

  // Get the audio download tasks for each subject -> each voice actor -> each
  // pronunciation
  const rawTasks = subjects.flatMap(makeAudioFetchTasks);
  debug("%d raw fetch tasks", rawTasks.length);

  // Figure out which of the fetch tasks are not actually in the database, and
  // then only consider those
  const storedAudioMap = await getStoredAudioMap();
  const fetchTasks: AudioFetchTask[] = [];

  for (const task of rawTasks) {
    const { subjectId, actor, pronunciation, url } = task;
    const key = getAudioKey(subjectId, actor, pronunciation);
    const storedAudio = storedAudioMap[key];

    // Fetch the audio if it isn't yet cached, or if the url has changed
    if (!storedAudio || storedAudio.url !== url) {
      fetchTasks.push(task);
    }
  }

  debug("%d final fetch tasks", fetchTasks.length);
  if (!fetchTasks.length) return [];

  // Refuse to do any work if we're over the max
  const max = getIntegerSetting("audioFetchMax") ?? 100;
  if (honorMax && fetchTasks.length > max) {
    debug("over max of %d fetch tasks and we honor, skipping", max);
    return [];
  }

  // Add all the tasks to the audio sync progress bar total
  store.dispatch(actions.incrSyncingAudioQueue(fetchTasks.length));

  lsSetNumber("audioFetchLastVersion", syncCurrentVersion);

  // Add the tasks into the queue and return when they're done
  return await audioFetchQueue.addAll<StoredAudio>(
    fetchTasks.map(t => () => performAudioFetch(t)),
    {
      priority: 10, // Manual fetch tasks are likely high priority
      throwOnTimeout: true
    }
  );
}

async function performAudioFetch({
  subjectId, actor,
  pronunciation, url,
  contentType
}: AudioFetchTask): Promise<StoredAudio> {
  const key = getAudioKey(subjectId, actor, pronunciation);
  debug("fetching audio for %s: %s", subjectId, url);

  try {
    // Fetch the audio data from the CDN
    const res = await fetch(url);
    const data = await res.blob();

    // Store the audio blob in the database
    const audio: StoredAudio = { key, url, data, contentType };
    db.audio.put(audio);
    return audio;
  } catch (err) {
    console.error(err);
    globalNotification.error({ message: "Could not fetch audio, see console for details." });
    throw err;
  } finally {
    // TODO: Get redux-debounced working
    store.dispatch(actions.incrSyncingAudioProgress());
  }
}

function makeAudioFetchTasks(subject: StoredSubject): AudioFetchTask[] {
  if (subject.object !== "vocabulary") return [];
  const audios = subject.data.pronunciation_audios;
  if (audios.length <= 0) return [];

  // Group by actor, then by pronunciation
  const grouped = mapValues(groupBy(audios, "metadata.voice_actor_id"),
    v => groupBy(v, "metadata.pronunciation"));
  const audioDefs: AudioFetchTask[] = [];

  // Pick an audio for each voice actor
  for (const actor in grouped) {
    const actorGroup = grouped[actor];

    // Pick an audio for each pronunciation
    for (const pronunciation in actorGroup) {
      const audios = actorGroup[pronunciation];

      // Convert the content types to our priority numbers and then sort, and
      // pick the first as the prioritized audio URL
      const mapped = audios.map(a => ({
        url: a.url,
        contentType: a.content_type as AudioContentType,
        priority: FORMAT_PRIORITY[a.content_type as AudioContentType]
      }));

      mapped.sort(cmpMap(a => a.priority, asc));
      const primary = mapped[0];

      // Add the fetch task for the primary audio
      audioDefs.push({
        subjectId: subject.id,
        actor: Number(actor),
        pronunciation,
        url: primary.url,
        contentType: primary.contentType
      });
    }
  }

  return audioDefs;
}
