// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Row, Col, ColProps } from "antd";

import { StoredSubject } from "@api";
import { JOYO_GRADE_NAMES, JLPT_LEVEL_NAMES, nts } from "@utils";

import { OrdinalNumber } from "@comp/OrdinalNumber";

interface Props {
  subject: StoredSubject;
}

export function DictionaryInfoRow({ subject }: Props): JSX.Element | null {
  // No data, return null
  const { jisho } = subject.data;
  if (!jisho) return null;

  const { jlpt, joyo, nfr, stroke } = jisho;
  const hasJlpt = (jlpt as number) !== 0, hasJoyo = (joyo as number) !== 0,
    hasNfr = (nfr as number) !== 0, hasStroke = (stroke as number) !== 0;

  // No data, return null
  if (!hasJlpt && !hasJoyo && !hasNfr && !hasStroke) return null;

  const colProps: ColProps = { flex: "auto" };

  return <Row className="text-center mt-[32px]">
    {/* Stroke count */}
    {hasStroke && <Col {...colProps}>
      <Header>Stroke count</Header>
      <Value>{nts(stroke)}</Value>
    </Col>}

    {/* JLPT */}
    {hasJlpt && <Col {...colProps}>
      <Header>JLPT level</Header>
      <Value>{JLPT_LEVEL_NAMES[jlpt]}</Value>
    </Col>}

    {/* Jōyō */}
    {hasJoyo && <Col {...colProps}>
      <Header>Jōyō grade</Header>
      <Value>{JOYO_GRADE_NAMES[joyo]}</Value>
    </Col>}

    {/* Newspaper frequency */}
    {hasNfr && <Col {...colProps}>
      <Header>Newspaper frequency</Header>
      <Value><OrdinalNumber value={nfr} /></Value>
    </Col>}
  </Row>;
}

const Header = ({ children }: { children: ReactNode }): JSX.Element =>
  <div className="text-sm text-desc">{children}</div>;

const Value = ({ children }: { children: ReactNode }): JSX.Element =>
  <div className="text-lg">{children}</div>;
