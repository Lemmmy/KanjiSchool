// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

export interface ApiObject<T> {
  id?: number;
  object: ObjectType;
  url: string;
  data_updated_at: string;
  data: T;
}
export type ObjectType = "collection" | "report" | "assignment" | "kanji" |
  "level_progression" | "radical" | "reset" | "review_statistic" | "review" |
  "spaced_repetition_system" | "study_material" | "user" | "vocabulary";

export interface ApiCollection<T> extends Omit<ApiObject<T[]>, "id"> {
  object: "collection";
  pages: {
    next_url: string | null;
    previous_url: string | null;
    per_page: number;
  };
  total_count: number;
}

export * from "./assignments";
export * from "./level";
export * from "./reviews";
export * from "./srs";
export * from "./studyMaterials";
export * from "./subjects";
export * from "./summary";
export * from "./user";
