// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Row, Col, ColProps } from "antd";

import { StoredSubject } from "@api";
import { JOYO_GRADE_NAMES, JLPT_LEVEL_NAMES, nts } from "@utils";

import { OrdinalNumber } from "@comp/OrdinalNumber";

interface Props {
  subject: StoredSubject;
}

export function Jisho({ subject }: Props): JSX.Element | null {
  // No data, return null
  const { jisho } = subject.data;
  if (!jisho) return null;

  const { jlpt, joyo, nfr, stroke } = jisho;
  const hasJlpt = (jlpt as number) !== 0, hasJoyo = (joyo as number) !== 0,
    hasNfr = (nfr as number) !== 0, hasStroke = (stroke as number) !== 0;

  // No data, return null
  if (!hasJlpt && !hasJoyo && !hasNfr && !hasStroke) return null;

  const colProps: ColProps = { flex: "auto" };

  return <Row className="subject-info-jisho-row">
    {/* Stroke count */}
    {hasStroke && <Col {...colProps}>
      <span className="jisho-header">Stroke count</span>
      <span className="jisho-value">
        {nts(stroke)}
      </span>
    </Col>}

    {/* JLPT */}
    {hasJlpt && <Col {...colProps}>
      <span className="jisho-header">JLPT level</span>
      <span className="jisho-value">{JLPT_LEVEL_NAMES[jlpt]}</span>
    </Col>}

    {/* Jōyō */}
    {hasJoyo && <Col {...colProps}>
      <span className="jisho-header">Jōyō grade</span>
      <span className="jisho-value">{JOYO_GRADE_NAMES[joyo]}</span>
    </Col>}

    {/* Newspaper frequency */}
    {hasNfr && <Col {...colProps}>
      <span className="jisho-header">Newspaper frequency</span>
      <span className="jisho-value">
        <OrdinalNumber value={nfr} />
      </span>
    </Col>}
  </Row>;
}
