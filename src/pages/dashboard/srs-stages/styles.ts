// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";
import { NormalizedSubjectType } from "@api";
import { SrsStageBaseName } from "@utils";

export const baseStageClasses = "inline-block p-sm rounded transition-colors text-center leading-tight cursor-pointer";

export const lockedSquareTextClasses = classNames(
  "text-white light:text-black",
  "light:palette-fdd:text-white",
  "palette-fdl:text-white light:palette-fdl:text-black"
);

export const lockedSquareClasses = classNames(
  baseStageClasses,
  lockedSquareTextClasses,
  "bg-srs-locked"
);

export const subjectTypeClasses: Record<NormalizedSubjectType, string> = {
  radical:    "bg-radical hover:bg-radical-lighter",
  kanji:      "bg-kanji hover:bg-kanji-lighter",
  vocabulary: "bg-vocabulary hover:bg-vocabulary-lighter",
};

export const srsStageClasses: Partial<Record<SrsStageBaseName, string>> = {
  "Apprentice":  "bg-srs-apprentice hover:bg-srs-apprentice-lighter",
  "Guru":        "bg-srs-guru hover:bg-srs-guru-lighter",
  "Master":      "bg-srs-master hover:bg-srs-master-lighter",
  "Enlightened": "bg-srs-enlightened hover:bg-srs-enlightened-lighter",
  "Burned":      "bg-srs-burned hover:bg-srs-burned-lighter palette-fdl:text-white"
};

export type KnownSmallType = "inProgress" | "passed" | "total";
export const knownSmallTypeClasses: Record<KnownSmallType, string> = {
  inProgress: "bg-srs-apprentice hover:bg-srs-apprentice-lighter",
  passed:     "text-white bg-srs-passed hover:bg-srs-passed-lighter",
  total:      "text-white bg-white/8 hover:bg-white/15"
};
