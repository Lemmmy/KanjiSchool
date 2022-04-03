// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import Highlighter from "react-highlight-words";

import { ApiSubjectVocabularyInner } from "@api";

interface Props {
  subject: ApiSubjectVocabularyInner;
}

export function ContextSentences({ subject }: Props): JSX.Element {
  return <div className="subject-info-context-sentences">
    {subject.context_sentences.map(s => (
      <div className="context-sentence" key={s.ja}>
        <p className="ja">
          <Highlighter
            autoEscape
            highlightClassName="ja-highlight"
            searchWords={subject.characters ? [subject.characters] : []}
            textToHighlight={s.ja}
          />
        </p>
        <p className="en">{s.en}</p>
      </div>
    ))}
  </div>;
}
