// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { StoredSubject } from "@api";
import { OrdinalNumber } from "@comp/OrdinalNumber";
import { JLPT_LEVEL_NAMES, JOYO_GRADE_NAMES } from "@utils";

interface Props {
  subject: StoredSubject;
  showJlpt?: boolean;
  showJoyo?: boolean;
  showFreq?: boolean;
}

/** The tooltip extra info - JLPT, Jōyō and newspaper frequency */
export function SubjectTooltipExtraData({
  subject,
  showJlpt, showJoyo, showFreq
}: Props): JSX.Element | null {
  const jisho = subject.data.jisho;
  if (!jisho) return null;

  const hasJlpt = showJlpt && jisho.jlpt !== undefined && (jisho.jlpt as number) !== 0;
  const hasJoyo = showJoyo  && jisho.joyo !== undefined && (jisho.joyo as number) !== 0;
  const hasFreq = showFreq && jisho.nfr !== undefined && (jisho.nfr as number) !== 0;
  if (!hasJlpt && !hasJoyo && !hasFreq) return null;

  return <>
    <div className="sep" />

    {/* JLPT */}
    {hasJlpt && <div className="row jlpt-row">
      <span className="label">JLPT Level:</span>
      {JLPT_LEVEL_NAMES[jisho.jlpt]}
    </div>}

    {/* Jōyō */}
    {hasJoyo && <div className="row joyo-row">
      <span className="label">Jōyō grade:</span>
      {JOYO_GRADE_NAMES[jisho.joyo]}
    </div>}

    {/* Newspaper frequency */}
    {hasFreq && <div className="row freq-row">
      <span className="label">Newspaper frequency:</span>
      <OrdinalNumber value={jisho.nfr} />
    </div>}
  </>;
}
