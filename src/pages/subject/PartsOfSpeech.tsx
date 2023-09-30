// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tag } from "antd";
import classNames from "classnames";

import { ApiSubjectKanaVocabularyInner, ApiSubjectVocabularyInner } from "@api";
import { slugifyPartOfSpeech } from "@utils";

interface Props {
  subject: ApiSubjectVocabularyInner | ApiSubjectKanaVocabularyInner;
}

const partClasses: Record<string, string> = {
  "noun"             : "!bg-blue",

  "proper-noun"      : "!bg-blue-5",
  "pronoun"          : "!bg-blue-5",

  "suru-verb"        : "!bg-green-6",
  "godan-verb"       : "!bg-green-6",
  "transitive-verb"  : "!bg-green-6",
  "intransitive-verb": "!bg-green-6",
  "ichidan-verb"     : "!bg-green-6",

  "adverb"           : "!bg-green-8",

  "no-adjective"     : "!bg-[#722ed1]",
  "na-adjective"     : "!bg-[#722ed1]",
  "i-adjective"      : "!bg-[#722ed1]",
  "adjective"        : "!bg-[#722ed1]",

  "numeral"          : "!bg-orange-6",
  "expression"       : "!bg-[#13c2c2]",

  "suffix"           : "!bg-red-6",
  "prefix"           : "!bg-yellow-7",
};

export function PartsOfSpeech({ subject }: Props): JSX.Element {
  return <div className="subject-info-parts-of-speech">
    {subject.parts_of_speech.map(p => (
      <Tag
        key={p}
        className={classNames(
          "text-white border-0 bg-white/20 light:bg-black/50",
          partClasses[slugifyPartOfSpeech(p)]
        )}
      >
        {p}
      </Tag>
    ))}
  </div>;
}
