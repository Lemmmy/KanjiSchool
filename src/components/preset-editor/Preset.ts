// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { LessonOpts, ReviewOpts } from "@session/order/options";

export type PresetType = "lesson" | "review";

export interface Preset {
  uuid: string;
  name: string;
  nameNode?: ReactNode;
  types: PresetType[];
  opts: Partial<LessonOpts | ReviewOpts>;
}
