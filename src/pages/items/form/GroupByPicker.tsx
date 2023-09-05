// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import { Row, Col } from "antd";

import { ItemsBaseType, ItemsGroupBy } from "../types/types";
import { EpicRadioGroup } from "./base/EpicRadioGroup";
import { ItemsConfigFormDivider } from "./base/ItemsConfigFormDivider.tsx";

export const ALLOWED_GROUP_BY: Record<ItemsBaseType, ItemsGroupBy[]> = {
  "wk": ["none", "level", "type", "srs"],
  "jlpt": ["none", "jlpt", "level", "srs"],
  "joyo": ["none", "joyo", "level", "srs"],
  "freq": ["none", "freq", "level", "srs"]
};

const GROUP_BY_LABELS: Record<ItemsGroupBy, string> = {
  "none": "None",
  "jlpt": "JLPT level",
  "joyo": "Jōyō grade",
  "freq": "Frequency",
  "level": "WK level",
  "type": "Item type",
  "srs": "SRS stage"
};

const TOOLTIP = <>
  Click to group items, sorted in ascending order.<br />
  Click again to reverse the sort order.
</>;

interface Props {
  type: ItemsBaseType;
}

export function GroupByPicker({ type }: Props): JSX.Element {
  const options = useMemo(() => ALLOWED_GROUP_BY[type]
    .map(value => ({ value, label: GROUP_BY_LABELS[value] })), [type]);

  return <>
    {/* Header */}
    <Row gutter={16}>
      <Col span={24}><ItemsConfigFormDivider label="Group by" /></Col>
    </Row>

    <Row gutter={16} style={{ marginBottom: 16 }}>
      {/* Primary */}
      <Col span={24}>
        <EpicRadioGroup
          orderField="groupByPrimaryOrder"
          name="groupByPrimary" label="Primary" tooltip={TOOLTIP}
          options={options}
        />
      </Col>

      {/* Secondary */}
      <Col span={24}>
        <EpicRadioGroup
          orderField="groupBySecondaryOrder"
          name="groupBySecondary" label="Secondary" tooltip={TOOLTIP}
          options={options}
          linkedRadio="groupByPrimary"
        />
      </Col>
    </Row>
  </>;
}
