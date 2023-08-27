// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { useNavigate } from "react-router-dom";

import { gotoSearch, NormalizedSubjectType } from "@api";

import { startCase } from "lodash-es";
import { nts } from "@utils";
import { baseStageClasses } from "@pages/dashboard/srs-stages/SrsStagesCard.tsx";

interface KnownSubjectsProps {
  type: NormalizedSubjectType;
  count: number;
}

const KNOWN_STAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const typeClasses: Record<NormalizedSubjectType, string> = {
  radical:    "bg-radical hover:bg-radical-lighter",
  kanji:      "bg-kanji hover:bg-kanji-lighter",
  vocabulary: "bg-vocabulary hover:bg-vocabulary-lighter",
};

export function KnownSubjects({ type, count }: KnownSubjectsProps): JSX.Element {
  const navigate = useNavigate();

  const name = startCase(type);

  function onClick() {
    gotoSearch(navigate, {
      srsStages: KNOWN_STAGES,
      subjectTypes: [type]
    }, true, true);
  }

  const classes = classNames(baseStageClasses, "mt-md", typeClasses[type]);

  return <div className={classes} onClick={onClick}>
    <div>{name}</div>
    <div className="text-4xl">{nts(count)}</div>
  </div>;
}
