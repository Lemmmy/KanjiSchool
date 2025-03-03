// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { db } from "@db";

export async function getCharacterImage(subjectId: number): Promise<string | undefined> {
  const storedImage = await db.characterImages.get(subjectId);
  return storedImage?.svg;
}
