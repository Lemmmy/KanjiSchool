// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Form, Row, Col } from "antd";

import { ToggleButtonGroup, ToggleButtonGroupItem } from "./base/ToggleButtonGroup";

import { getSrsStageBaseName, SrsStageBaseName, stringifySrsStage } from "@utils";

type BorderClass = Lowercase<SrsStageBaseName> | "not-on-wk";
const borderClasses: Record<BorderClass, string> = {
  "apprentice"  : "border-b-srs-apprentice",
  "guru"        : "border-b-srs-guru",
  "master"      : "border-b-srs-master",
  "enlightened" : "border-b-srs-enlightened",
  "burned"      : "border-b-srs-burned",
  "lesson"      : "border-b-srs-lesson",
  "locked"      : "border-b-srs-locked",
  "not-on-wk"   : "border-b-srs-not-on-wk",
};

const ITEMS: ToggleButtonGroupItem<string>[] =
  [10, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(s => ({
    value: s.toString(),
    label: stringifySrsStage(s),
    className: borderClasses[getSrsStageBaseName(s).toLowerCase() as BorderClass]
  }));

const ITEMS_NOT_ON_WK: ToggleButtonGroupItem<string>[] = [
  ...ITEMS,
  {
    value: "11",
    label: "Not on WK",
    className: borderClasses["not-on-wk"]
  }
];

interface Props {
  showNotOnWk?: boolean;
}

export function SrsPicker({ showNotOnWk, ...props }: Props): JSX.Element {
  return <Row gutter={16} className="mb-md">
    <Col span={24}>
      <Form.Item name="srsStages" label="SRS stage" className="mb-sm" {...props}>
        <ToggleButtonGroup
          items={showNotOnWk ? ITEMS_NOT_ON_WK : ITEMS}
        />
      </Form.Item>
    </Col>
  </Row>;
}
