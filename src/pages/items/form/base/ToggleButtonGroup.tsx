// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Tooltip } from "antd";
import classNames from "classnames";

export interface ToggleButtonGroupItem<T extends string> {
  value: T;
  label: ReactNode;
  className?: string;
}

export interface ToggleButtonGroupItemButtonProps<T extends string> extends ToggleButtonGroupItem<T> {
  selected: boolean;
  oneSelected?: T;
  selectItem: (item: T) => void;
  deselectItem: (item: T) => void;
  deselectAllBut: (item: T) => void;
  selectAll: () => void;
}

interface Props<T extends string> {
  items: ToggleButtonGroupItem<T>[];

  value?: T[];
  onChange?: (value: T[]) => void;

  className?: string;
  hasBorderColors?: boolean;
  size?: "small" | "middle";
}

const TOOLTIP = <>
  Click to toggle visibility of this category.<br />
  Shift-click to hide all except this category.<br />
  Shift-click again to restore all items to visible.
</>;

export function ToggleButtonGroup<T extends string>({
  items,
  value,
  onChange,
  className,
  hasBorderColors,
  size = "middle"
}: Props<T>): JSX.Element {
  const selectItem     = (item: T) => onChange?.(Array.from(new Set(value ?? []).add(item)));
  const deselectItem   = (item: T) => onChange?.((value ?? []).filter(v => v !== item));
  const deselectAllBut = (item: T) => onChange?.([item]);
  const selectAll      = () => onChange?.(items.map(i => i.value));
  const oneSelected = value && value.length === 1 ? value[0] : undefined;

  // Part of the trick is pretending to be an ant radio group:
  const classes = classNames(
    "ant-radio-group",
    "ant-radio-group-solid",
    "ant-radio-group-" + size,
    "toggle-button-group",
    className,
    { "with-border-colors": hasBorderColors }
  );

  return <Tooltip
    title={TOOLTIP}
    placement="bottomLeft"
    overlayClassName="toggle-button-group-tooltip"
    mouseEnterDelay={0.5}
    mouseLeaveDelay={0}
  >
    <div className={classes}>
      {items.map(item => <ToggleButtonGroupButton
        key={item.value}
        selected={value?.includes(item.value) ?? false}
        oneSelected={oneSelected}
        selectItem={selectItem}
        deselectItem={deselectItem}
        deselectAllBut={deselectAllBut}
        selectAll={selectAll}
        {...item}
      />)}
    </div>
  </Tooltip>;
}

function ToggleButtonGroupButton<T extends string>({
  value,
  label,
  selected, oneSelected,
  selectItem, deselectItem, deselectAllBut, selectAll,
  className
}: ToggleButtonGroupItemButtonProps<T>): JSX.Element {
  function onClick(e: React.MouseEvent<HTMLInputElement>) {
    if (e.shiftKey) {
      // If we shift-clicked just this item again, re-select all
      if (oneSelected === value) selectAll();
      // Otherwise if shift-clicked, deselect all but this
      else deselectAllBut(value);
    } else {
      // Otherwise we write a comment here hoping eslint will shut up but it
      // won't so here's an eslint-disable-next-line anyway
      // eslint-disable-next-line no-lonely-if
      if (selected) deselectItem(value);
      else selectItem(value);
    }
  }

  const classes = classNames(
    "ant-radio-button-wrapper",
    className,
    { "ant-radio-button-wrapper-checked": selected }
  );

  return <label className={classes}>
    {/* Radio container */}
    <span className="ant-radio-button">
      <input
        className="ant-radio-button-input"
        type="radio"
        value={value}
        onClick={onClick}
      />
      <span className="ant-radio-button-inner" /> {/* Why? */}
    </span>

    {/* Label */}
    <span>{label}</span>
  </label>;
}
