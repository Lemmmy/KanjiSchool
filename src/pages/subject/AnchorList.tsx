// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import { Affix, Anchor, AnchorProps } from "antd";

import { StoredSubject, StoredAssignment, ApiSubjectKanjiInner } from "@api";

import { HintStageObject } from "./hintStages";
import { normalizeVocabType } from "@utils";
import classNames from "classnames";

interface Props {
  subject: StoredSubject;
  assignment?: StoredAssignment;

  show: (object: HintStageObject) => boolean;
  showDebug: boolean;
}

const linkClass = "py-[5px] pl-0 pr-[16px]";

export function AnchorList({
  subject,
  assignment,
  show,
  showDebug
}: Props): JSX.Element {
  const type = normalizeVocabType(subject.object);

  const anchorItems: AnchorProps["items"] = useMemo(() => {
    const items: AnchorProps["items"] = [];

    const kanjiSubjectData = subject.data as ApiSubjectKanjiInner;

    items.push({ key: "subject-info", href: "#subject-info", title: "Subject info" });

    if (type === "kanji" && show("used_radicals"))
      items.push({ key: "used-radicals", href: "#used-radicals", title: "Used radicals" });
    if (subject.object === "vocabulary" && show("used_kanji"))
      items.push({ key: "used-kanji", href: "#used-kanji", title: "Used kanji" });

    if (show("meaning_mnemonic"))
      items.push({ key: "meaning-mnemonic", href: "#meaning-mnemonic", title: "Meaning mnemonic" });
    if (type !== "radical" && show("reading_mnemonic"))
      items.push({ key: "reading-mnemonic", href: "#reading-mnemonic", title: "Reading mnemonic" });

    if (type === "kanji" && !!subject.data.jisho && show("kanji_jisho"))
      items.push({ key: "dictionary-info", href: "#dictionary-info", title: "Dictionary info" });
    if (type === "radical" && show("used_in_kanji"))
      items.push({ key: "used-in", href: "#used-in", title: "Used in" });
    if (type === "kanji" && show("visually_similar_kanji") &&
      kanjiSubjectData.visually_similar_subject_ids.length > 0)
      items.push({ key: "visually-similar", href: "#visually-similar", title: "Visually similar" });
    if (type === "kanji" && show("used_in_vocabulary"))
      items.push({ key: "used-in", href: "#used-in", title: "Used in" });

    if (type === "vocabulary" && show("part_of_speech"))
      items.push({ key: "parts-of-speech", href: "#parts-of-speech", title: "Parts of speech" });
    if (type === "vocabulary" && show("context_sentences"))
      items.push({ key: "context-sentences", href: "#context-sentences", title: "Context sentences" });

    if (show("progression") && assignment)
      items.push({ key: "your-progression", href: "#your-progression", title: "Your progression" });

    if (showDebug) {
      items.push({ key: "debug", href: "#debug", title: "Debug", className: "[&_a]:!text-[#722ed1]" });
    }

    // Add linkClass to all items
    items.forEach(i => i.className = classNames(linkClass, i.className));

    return items;
  }, [type, subject, assignment, show, showDebug]);

  return <div>
    <Affix
      // `.toc-affix` class is overridden by session page animations in `SessionQuestionContents.tsx`
      className="toc-affix opacity-100 transition-opacity absolute top-lg w-toc right-toc-right hidden md:block"
      offsetTop={24}
    >
      <Anchor
        className="text-sm"
        showInkInFixed={true}
        affix={false}
        offsetTop={48}
        items={anchorItems}
      />
    </Affix>
  </div>;
}
