// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { SrsStageBaseName } from "@utils";

export type BarStageName = Exclude<Lowercase<SrsStageBaseName>, "lesson" | "locked">;

export const barColors: Record<BarStageName, string> = {
  apprentice: "bg-srs-apprentice",
  guru: "bg-srs-guru",
  master: "bg-srs-master",
  enlightened: "bg-srs-enlightened",
  burned: "bg-srs-burned",
};

export const barHoverColors: Record<BarStageName, string> = {
  apprentice: "hover:bg-srs-apprentice-lighter",
  guru: "hover:bg-srs-guru-lighter",
  master: "hover:bg-srs-master-lighter",
  enlightened: "hover:bg-srs-enlightened-lighter",
  burned: "hover:bg-srs-burned-lighter",
};

export const barTooltipColors: Record<BarStageName, string> = {
  apprentice: "bg-srs-apprentice-dark",
  guru: "bg-srs-guru-dark",
  master: "bg-srs-master-dark text-shadow-sm shadow-black/60",
  enlightened: "bg-srs-enlightened-dark",
  burned: "bg-srs-burned-dark",
};
