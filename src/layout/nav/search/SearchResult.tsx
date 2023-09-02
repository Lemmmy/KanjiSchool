// Copyright (c) 2021-2023 Drew Edwards
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

const SearchResult = React.memo(({
  subject,
  query,
  queryKana
}: Props): JSX.Element => {
  const { meanings, level } = subject.data;
  const reading = getPrimaryReading(subject);

  const userLevel = useUserLevel();

  const classes = classNames("text-base whitespace-normal", {
    "opacity-70": userLevel < level
  });

  const highlightClass = "!bg-transparent p-0 text-inherit font-bold";

  // URL for the subject page
  const url = getSubjectUrl(subject);

  const contents = <div className={classes}>
    {/* Subject level */}
    <span
      className={classNames("float-right font-sm text-desc", {
        "text-red": userLevel < level
      })}
    >
      Lvl {level}
    </span>

    {/* Subject characters and reading */}
    <div>
      <SubjectCharacters
        subject={subject}
        max={20}
        fontClassName="text-[24px] leading-[24px]"
        imageSizeClassName="w-[24px] h-[24px]"
      />

      {/* Single primary reading */}
      {reading && <>
        <span className="mx-xss font-lg">-</span>
        <span className="font-lg font-ja">
          <Highlighter
            autoEscape
            highlightClassName={highlightClass}
            searchWords={[query, queryKana]}
            textToHighlight={reading}
          />
        </span>
      </>}
    </div>

    {/* Meanings */}
    <div>
      <CommaList
        type="meaning"
        values={meanings.map(m => [
          m.meaning,
          false,
          <Highlighter
            autoEscape
            key="hl"
            highlightClassName={highlightClass}
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

export default SearchResult;
