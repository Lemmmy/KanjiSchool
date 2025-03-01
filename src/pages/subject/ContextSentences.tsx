// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import Highlighter from "react-highlight-words";

import { ApiSubjectKanaVocabularyInner, ApiSubjectVocabularyInner } from "@api";

interface Props {
  subject: ApiSubjectVocabularyInner | ApiSubjectKanaVocabularyInner;
}

export default function ContextSentences({ subject }: Props): JSX.Element {
  return <div className="flex flex-col gap-md">
    {subject.context_sentences.map(s => (
      <div key={s.ja}>
        {/* Japanese */}
        <p className="font-ja my-0 text-lg">
          <Highlighter
            autoEscape
            highlightClassName="text-vocabulary bg-transparent p-0"
            searchWords={subject.characters ? [subject.characters] : []}
            textToHighlight={s.ja}
          />
        </p>

        {/* English */}
        <p className="my-0 text-desc">
          {s.en}
        </p>
      </div>
    ))}
  </div>;
}
