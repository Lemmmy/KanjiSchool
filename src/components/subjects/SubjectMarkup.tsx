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

  // Newlines to <br />, since paragraphs get removed
  children = children.replace(/\n/g, "<br />");

  return <Markdown
    className={classNames("block [&_br]:block [&_br]:[content:''] [&_br]:mb-sm", className)}
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

const partClass = "inline-block px-[0.325em] mx-[0.1em] text-white rounded-sm font-bold leading-[1.25] " +
  "whitespace-nowrap [text-shadow:0_2px_0_rgba(0,0,0,0.4),0_1px_3px_rgba(0,0,0,0.5)]" +
  "bg-container light:bg-black/15 light:![text-shadow:none]";

const MarkupRadical = ({ children }: MarkupPartProps): ReactNode =>
  <span className={classNames(partClass, "!bg-radical-dark")}>{children}</span>;
const MarkupKanji = ({ children }: MarkupPartProps): ReactNode =>
  <span className={classNames(partClass, "!bg-kanji-dark")}>{children}</span>;
const MarkupVocabulary = ({ children }: MarkupPartProps): ReactNode =>
  <span className={classNames(partClass, "!bg-vocabulary-dark")}>{children}</span>;
const MarkupMeaning = ({ children }: MarkupPartProps): ReactNode =>
  <span className={partClass}>{children}</span>;
const MarkupReading = ({ children }: MarkupPartProps): ReactNode =>
  <span className={classNames(partClass, "!bg-reading light:text-black light:!bg-black/15")}>
    {children}
  </span>;
const MarkupJa = ({ children }: MarkupPartProps): ReactNode =>
  <span className="font-ja">{children}</span>;
