// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { store } from "@store";
import { setImagesSynced, setSyncingImages, setSyncingImagesProgress } from "@store/slices/syncSlice.ts";
import { initImages } from "@store/slices/imagesSlice.ts";

import { ApiCharacterImage } from "@api";
import { db } from "@db";

import { globalNotification } from "@global/AntInterface.tsx";

import Debug from "debug";
const debug = Debug("kanjischool:api-sync-images");

export interface StoredImage {
  id: number; // Subject ID
  cachedUrl: string;
  svg: string;
}
export type StoredImageMap = Record<number, StoredImage>;

// Fetch the first available SVG image
const findSvg = (images: ApiCharacterImage[]): string | undefined =>
  images.find(i => i.content_type === "image/svg+xml")?.url;

export async function syncImages(): Promise<void> {
  if (store.getState().sync.syncingImages) return;
  store.dispatch(setSyncingImages(true));

  debug("syncing images from subjects");

  // Find the subjects that use images
  const { subjects } = store.getState().subjects;
  if (!subjects) throw new Error("No subjects");

  const subjectsWithImages: Record<number, string> = [];
  for (const subjectId in subjects) {
    const subject = subjects[subjectId];
    if (subject.object !== "radical") continue;
    if (subject.data.characters || !subject.data.character_images?.length)
      continue;

    const img = findSvg(subject.data.character_images);
    if (!img) {
      debug("subject %d has no character images", subjectId);
      continue;
    }

    subjectsWithImages[subject.id] = img;
  }

  debug("found %d subjects that use images", Object.keys(subjectsWithImages).length);

  // Check against the database to see if we have these stored already
  const storedImages = await db.characterImages.toArray();
  const storedImageMap: Record<number, StoredImage> = {};
  for (const i of storedImages) { storedImageMap[i.id] = i; }

  const total = Object.keys(subjectsWithImages).length;
  let count = 0;
  for (const subjectId in subjectsWithImages) {
    const url = subjectsWithImages[subjectId];
    const storedImage = storedImageMap[subjectId];

    // Fetch the image if it isn't yet cached, or if the url has changed
    if (!storedImage || storedImage.cachedUrl !== url) {
      debug("fetching image for %s: %s", subjectId, url);

      try {
        const res = await fetch(url);
        const data = await res.text();
        db.characterImages.put({
          id: Number(subjectId),
          cachedUrl: url,
          svg: data
        });
      } catch (err) {
        console.error(err);
        globalNotification.error({ message: "Could not fetch subject image, see console for details." });
      }
    }

    count++;
    store.dispatch(setSyncingImagesProgress({ count, total }));
  }

  store.dispatch(setSyncingImages(false));
  store.dispatch(setImagesSynced(true));

  await loadImages();
}

/** Load all the image SVGs from the database into the Redux store. */
export async function loadImages(): Promise<void> {
  debug("loading images");

  // If there are no images in the database, then return immediately.
  if (await db.characterImages.count() === 0) {
    debug("no images in the database, not loading anything");
    return;
  }

  const images = await db.characterImages.toArray();
  const imageMap: StoredImageMap = {};
  for (const i of images) { imageMap[i.id] = i; }

  store.dispatch(initImages(imageMap));
}
