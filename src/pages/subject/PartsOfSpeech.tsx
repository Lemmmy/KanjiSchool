// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tag } from "antd";

import { ApiSubjectVocabularyInner } from "@api";
import { slugifyPartOfSpeech } from "@utils";

interface Props {
  subject: ApiSubjectVocabularyInner;
}

export function PartsOfSpeech({ subject }: Props): JSX.Element {
  return <div className="subject-info-parts-of-speech">
    {subject.parts_of_speech.map(p => (
      <Tag key={p} className={"part-of-speech " + slugifyPartOfSpeech(p)}>
        {p}
      </Tag>
    ))}
  </div>;
}
