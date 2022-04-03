// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import Dexie from "dexie";

import {
  StoredSubject, StoredAssignment,
  ApiReviewStatistic, ApiReview, ApiLevelProgression, ApiStudyMaterial,
  StoredImage, StoredAudio,
  StoredQueueItem,
} from "@api";

import Debug from "debug";
const debug = Debug("kanjischool:db");

class WkDb extends Dexie {
  subjects: Dexie.Table<StoredSubject, number>;
  assignments: Dexie.Table<StoredAssignment, number>;
  reviewStatistics: Dexie.Table<ApiReviewStatistic, number>;
  reviews: Dexie.Table<ApiReview, number>;
  levelProgressions: Dexie.Table<ApiLevelProgression, number>;
  studyMaterials: Dexie.Table<ApiStudyMaterial, number>;
  characterImages: Dexie.Table<StoredImage, number>;
  audio: Dexie.Table<StoredAudio, string>;
  queue: Dexie.Table<StoredQueueItem, number>;

  constructor() {
    super("kanjischool");
    debug("db constructor");

    this.version(24).stores({
      subjects: "++id",
      assignments: "++id, data.started_at, data.available_at",
      reviewStatistics: "++id",
      reviews: "++id, data_updated_at",
      levelProgressions: "++id",
      studyMaterials: "++id",
      characterImages: "++id",
      audio: "key",
      queue: "++id"
    });

    this.subjects = this.table("subjects");
    this.assignments = this.table("assignments");
    this.reviewStatistics = this.table("reviewStatistics");
    this.reviews = this.table("reviews");
    this.levelProgressions = this.table("levelProgressions");
    this.studyMaterials = this.table("studyMaterials");
    this.characterImages = this.table("characterImages");
    this.audio = this.table("audio");
    this.queue = this.table("queue");
  }
}

export let db: WkDb;

export async function initDatabase(): Promise<WkDb> {
  if (db) return db;
  db = new WkDb();
  return db;
}
