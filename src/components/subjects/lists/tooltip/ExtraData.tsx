// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { StoredSubject } from "@api";
import { OrdinalNumber } from "@comp/OrdinalNumber";
import { JLPT_LEVEL_NAMES, JOYO_GRADE_NAMES } from "@utils";
import { SubjectTooltipSeparator } from "@comp/subjects/lists/tooltip/SubjectTooltipSeparator.tsx";
import { SubjectTooltipLabel } from "@comp/subjects/lists/tooltip/SubjectTooltipLabel.tsx";

interface Props {
  subject: StoredSubject;
  showJlpt?: boolean;
  showJoyo?: boolean;
  showFreq?: boolean;
}

/** The tooltip extra info - JLPT, Jōyō and newspaper frequency */
export function SubjectTooltipExtraData({
  subject,
  showJlpt,
  showJoyo,
  showFreq
}: Props): JSX.Element | null {
  const jisho = subject.data.jisho;
  if (!jisho) return null;

  const hasJlpt = showJlpt && jisho.jlpt !== undefined && (jisho.jlpt as number) !== 0;
  const hasJoyo = showJoyo  && jisho.joyo !== undefined && (jisho.joyo as number) !== 0;
  const hasFreq = showFreq && jisho.nfr !== undefined && (jisho.nfr as number) !== 0;
  if (!hasJlpt && !hasJoyo && !hasFreq) return null;

  return <>
    <SubjectTooltipSeparator />

    {/* JLPT */}
    {hasJlpt && <div>
      <SubjectTooltipLabel>JLPT Level:</SubjectTooltipLabel>
      {JLPT_LEVEL_NAMES[jisho.jlpt]}
    </div>}

    {/* Jōyō */}
    {hasJoyo && <div>
      <SubjectTooltipLabel>Jōyō grade:</SubjectTooltipLabel>
      {JOYO_GRADE_NAMES[jisho.joyo]}
    </div>}

    {/* Newspaper frequency */}
    {hasFreq && <div>
      <SubjectTooltipLabel>Newspaper frequency:</SubjectTooltipLabel>
      <OrdinalNumber value={jisho.nfr} />
    </div>}
  </>;
}
