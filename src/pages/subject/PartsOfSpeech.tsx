// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiSubjectVocabularyInner } from "@api";
import { Tag, TagProps } from "@comp/Tag";
import { cn, slugifyPartOfSpeech } from "@utils";
import { forwardRef } from "react";

interface Props {
  partsOfSpeech: ApiSubjectVocabularyInner["parts_of_speech"];
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

interface PartOfSpeechProps extends Omit<TagProps, "children"> {
  partOfSpeech: string;
}

export const PartOfSpeech = forwardRef<HTMLSpanElement, PartOfSpeechProps>(
  ({ partOfSpeech, className, closable, onClose, ...props }, ref) => {
    return <Tag
      ref={ref}
      className={cn(
        partClasses[slugifyPartOfSpeech(partOfSpeech)],
        className
      )}
      closable={closable}
      onClose={onClose}
      {...props}
    >
      {partOfSpeech}
    </Tag>;
  }
);

PartOfSpeech.displayName = "PartOfSpeech";

export function PartsOfSpeechList({ partsOfSpeech }: Props): React.ReactElement {
  return <div className="subject-info-parts-of-speech flex flex-wrap gap-1">
    {partsOfSpeech.map(p => <PartOfSpeech key={p} partOfSpeech={p} />)}
  </div>;
}
