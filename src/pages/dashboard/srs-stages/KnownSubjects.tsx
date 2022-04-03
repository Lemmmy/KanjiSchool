// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

import { useHistory } from "react-router-dom";

import { gotoSearch, SubjectType } from "@api";

import { startCase } from "lodash-es";
import { nts } from "@utils";

interface KnownSubjectsProps {
  type: SubjectType;
  count: number;
}

const KNOWN_STAGES = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export function KnownSubjects({ type, count }: KnownSubjectsProps): JSX.Element {
  const history = useHistory();

  const name = startCase(type);

  function onClick() {
    gotoSearch(history, {
      srsStages: KNOWN_STAGES,
      subjectTypes: [type]
    }, true, true);
  }

  const classes = classNames("srs-stage", "known-subjects", "subject-" + type);

  return <div className={classes} onClick={onClick}>
    <span className="stage-name">{name}</span>
    <span className="stage-count">{nts(count)}</span>
  </div>;
}
