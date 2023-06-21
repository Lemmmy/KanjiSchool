// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useContext } from "react";
import { Affix, Anchor } from "antd";

import { StoredSubject, StoredAssignment } from "@api";

import { SiteLayoutContext } from "@layout/AppLayout";
import { HintStageObject } from "./hintStages";
import { normalizeVocabType } from "@utils";

const { Link } = Anchor;

interface Props {
  subject: StoredSubject;
  assignment?: StoredAssignment;

  show: (object: HintStageObject) => boolean;
  showDebug: boolean;
}

export function AnchorList({
  subject,
  assignment,
  show,
  showDebug
}: Props): JSX.Element {
  const type = normalizeVocabType(subject.object);

  const siteLayoutRef = useContext(SiteLayoutContext);

  return <div>
    <Affix
      className="toc-affix"
      target={() => siteLayoutRef}
      offsetTop={24}
    >
      <Anchor
        className="toc"
        showInkInFixed={true}
        affix={false}
        getContainer={() => siteLayoutRef ?? window}
        offsetTop={48}
      >
        {/* Links */}
        <Link href="#subject-info" title="Subject info" />
        {type === "kanji" && show("used_radicals") &&
          <Link href="#used-radicals" title="Used radicals" />}
        {subject.object === "vocabulary" && show("used_kanji") &&
          <Link href="#used-kanji" title="Used kanji" />}
        {show("meaning_mnemonic") &&
          <Link href="#meaning-mnemonic" title="Meaning mnemonic" />}
        {type !== "radical" && show("reading_mnemonic") &&
          <Link href="#reading-mnemonic" title="Reading mnemonic" />}
        {type === "kanji" && !!subject.data.jisho && show("kanji_jisho") &&
          <Link href="#dictionary-info" title="Dictionary info" />}
        {type === "radical" && show("used_in_kanji") &&
          <Link href="#used-in" title="Used in" />}
        {type === "kanji" && show("visually_similar_kanji") &&
          <Link href="#visually-similar" title="Visually similar" />}
        {type === "kanji" && show("used_in_vocabulary") &&
          <Link href="#used-in" title="Used in" />}
        {type === "vocabulary" && show("part_of_speech") &&
          <Link href="#parts-of-speech" title="Parts of speech" />}
        {type === "vocabulary" && show("context_sentences") &&
          <Link href="#context-sentences" title="Context sentences" />}
        {show("progression") && assignment &&
          <Link href="#your-progression" title="Your progression" />}
        {showDebug &&
          <Link href="#debug" title="Debug" className="toc-debug" />}
      </Anchor>
    </Affix>
  </div>;
}
