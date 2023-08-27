// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FC, ReactNode } from "react";
import classNames from "classnames";

import Markdown from "markdown-to-jsx";

interface Props {
  children: string;
  className?: string;
}

interface NoParagraphProps {
  children?: ReactNode;
}

const NoParagraph: FC<NoParagraphProps> = ({ children, ...props }) => (
  <span {...props}>{children}</span>
);

export const SubjectMarkup: FC<Props> = ({ children, className }) => {
  if (!children) return null;

  const classes = classNames("subject-markup", className);

  // Newlines to <br />, since paragraphs get removed
  children = children.replace(/\n/g, "<br />");

  return <Markdown
    className={classes}
    options={{
      forceInline: true,
      overrides: {
        p: { component: NoParagraph },
        rd: { component: MarkupRadical }, // Potential alias?
        radical: { component: MarkupRadical },
        kan: { component: MarkupKanji }, // Potential alias?
        kanji: { component: MarkupKanji },
        voc: { component: MarkupVocabulary }, // Potential alias?
        vocabulary: { component: MarkupVocabulary },

        // NOTE: <meaning> is never used:
        meaning: { component: MarkupMeaning },
        reading: { component: MarkupReading },

        // NOTE: <ja> is not documented, but it is used:
        ja: { component: MarkupJa }
      }
    }}
  >
    {children}
  </Markdown>;
};

interface MarkupPartProps {
  children: ReactNode;
}

const MarkupRadical = ({ children }: MarkupPartProps): ReactNode =>
  <span className="markup-part markup-radical">{children}</span>;
const MarkupKanji = ({ children }: MarkupPartProps): ReactNode =>
  <span className="markup-part markup-kanji">{children}</span>;
const MarkupVocabulary = ({ children }: MarkupPartProps): ReactNode =>
  <span className="markup-part markup-vocabulary">{children}</span>;
const MarkupMeaning = ({ children }: MarkupPartProps): ReactNode =>
  <span className="markup-part markup-meaning">{children}</span>;
const MarkupReading = ({ children }: MarkupPartProps): ReactNode =>
  <span className="markup-part markup-reading">{children}</span>;
const MarkupJa = ({ children }: MarkupPartProps): ReactNode =>
  <span className="markup-ja ja">{children}</span>;
