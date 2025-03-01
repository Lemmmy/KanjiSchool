// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { useNavigate } from "react-router-dom";

import { gotoSearch, NormalizedSubjectType } from "@api";

import { nts, uppercaseFirst } from "@utils";

import { baseStageClasses, subjectTypeClasses } from "./styles.ts";

interface KnownSubjectsProps {
  type: NormalizedSubjectType;
  count: number;
}

const KNOWN_STAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function KnownSubjects({ type, count }: KnownSubjectsProps): JSX.Element {
  const navigate = useNavigate();

  const name = uppercaseFirst(type);

  function onClick() {
    gotoSearch(navigate, {
      srsStages: KNOWN_STAGES,
      subjectTypes: [type]
    }, true, true);
  }

  const classes = classNames(baseStageClasses, "mt-md", subjectTypeClasses[type]);

  return <div className={classes} onClick={onClick}>
    <div>{name}</div>
    <div className="text-4xl">{nts(count)}</div>
  </div>;
}
