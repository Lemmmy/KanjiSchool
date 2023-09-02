// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import Highlighter from "react-highlight-words";

import { ApiSubjectKanaVocabularyInner, ApiSubjectVocabularyInner } from "@api";

interface Props {
  subject: ApiSubjectVocabularyInner | ApiSubjectKanaVocabularyInner;
}

export default function ContextSentences({ subject }: Props): JSX.Element {
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
