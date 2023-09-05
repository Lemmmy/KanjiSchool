// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import { Row, Col } from "antd";

import { ItemsBaseType, ItemsSortBy } from "../types/types";
import { EpicRadioGroup } from "./base/EpicRadioGroup";
import { ItemsConfigFormDivider } from "./base/ItemsConfigFormDivider.tsx";

export const ALLOWED_SORT_BY: Record<ItemsBaseType, ItemsSortBy[]> = {
  "wk": ["level", "type", "srs", "slug"],
  "jlpt": ["jlpt", "level", "srs", "slug"],
  "joyo": ["joyo", "level", "srs", "slug"],
  "freq": ["freq", "level", "srs", "slug"]
};

const SORT_BY_LABELS: Record<ItemsSortBy, string> = {
  "jlpt": "JLPT level",
  "joyo": "Jōyō grade",
  "freq": "Frequency",
  "level": "WK level",
  "type": "Item type",
  "srs": "SRS stage",
  "slug": "Item name",
};

const TOOLTIP = <>
  Click to sort in ascending order.<br />
  Click again to reverse the sort order.
</>;

interface Props {
  type: ItemsBaseType;
}

export function SortByPicker({ type }: Props): JSX.Element {
  const options = useMemo(() => ALLOWED_SORT_BY[type]
    .map(value => ({ value, label: SORT_BY_LABELS[value] })), [type]);

  return <>
    {/* Header */}
    <Row gutter={16}>
      <Col span={24}><ItemsConfigFormDivider label="Sort by" /></Col>
    </Row>

    <Row gutter={16} style={{ marginBottom: 16 }}>
      <Col span={24}>
        <EpicRadioGroup
          orderField="sortByOrder"
          name="sortBy" label="Sort by" tooltip={TOOLTIP}
          options={options}
          linkedRadio="groupByPrimary" allowNone
        />
      </Col>
    </Row>
  </>;
}
