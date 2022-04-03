// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React from "react";
import classNames from "classnames";

import { StoredSubject, useUserLevel } from "@api";

import { ConditionalLink } from "@comp/ConditionalLink";
import { SubjectCharacters } from "@comp/subjects/SubjectCharacters";
import { CommaList } from "@pages/subject/CommaList";
import Highlighter from "react-highlight-words";

import { getPrimaryReading, getSubjectUrl } from "@utils";

interface Props {
  subject: StoredSubject;
  query: string;
  queryKana: string;
}

export const SearchResultEl = React.memo(({
  subject,
  query,
  queryKana
}: Props): JSX.Element => {
  const { meanings, level } = subject.data;
  const reading = getPrimaryReading(subject);

  const userLevel = useUserLevel();

  const classes = classNames("search-result", {
    "unlocked": userLevel >= level
  });

  // URL for the subject page
  const url = getSubjectUrl(subject);

  const contents = <div className={classes}>
    {/* Subject level */}
    <span className="search-result-level">Lvl {level}</span>

    {/* Subject characters and reading */}
    <div className="result-row result-top">
      <SubjectCharacters subject={subject} max={20} />

      {/* Single primary reading */}
      {reading && <>
        <span className="sep">-</span>
        <span className="reading ja">
          <Highlighter
            autoEscape
            highlightClassName="search-highlight"
            searchWords={[query, queryKana]}
            textToHighlight={reading}
          />
        </span>
      </>}
    </div>

    {/* Meanings */}
    <div className="result-row">
      <CommaList
        type="meaning"
        values={meanings.map(m => [
          m.meaning,
          false,
          <Highlighter
            autoEscape
            key="hl"
            highlightClassName="search-highlight"
            searchWords={[query]}
            textToHighlight={m.meaning}
          />
        ])}
      />
    </div>
  </div>;

  return <ConditionalLink to={url} matchExact>
    {contents}
  </ConditionalLink>;
});
