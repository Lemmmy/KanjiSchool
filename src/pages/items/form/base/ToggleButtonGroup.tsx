// Copyright (c) 2021-2025 Drew Edwards
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
  className
}: Props<T>): React.ReactElement {
  const selectItem     = (item: T) => onChange?.(Array.from(new Set(value ?? []).add(item)));
  const deselectItem   = (item: T) => onChange?.((value ?? []).filter(v => v !== item));
  const deselectAllBut = (item: T) => onChange?.([item]);
  const selectAll      = () => onChange?.(items.map(i => i.value));
  const oneSelected = value && value.length === 1 ? value[0] : undefined;

  return <Tooltip
    title={TOOLTIP}
    placement="bottomLeft"
    overlayClassName="text-sm max-w-none"
    mouseEnterDelay={0.5}
    mouseLeaveDelay={0}
  >
    <div className={classNames("select-none", className)}>
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
}: ToggleButtonGroupItemButtonProps<T>): React.ReactElement {
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
    "inline-block !h-[28px] px-[8px] pb-[4px] first:rounded-is last:rounded-ie relative cursor-pointer",
    "border border-[#303030] border-solid border-b-[4px] border-split -ml-px whitespace-nowrap",
    "light:border-t-[#d9d9d9] light:border-l-[#d9d9d9] light:border-r-[#d9d9d9]",
    "hover:text-link transition-colors",
    className,
    {
      ["border-primary bg-primary/20 z-20 hover:text-white " +
        "light:border-t-blue-2 light:border-l-blue-2 light:border-r-blue-2"]: selected
    }
  );

  return <label className={classes}>
    {/* Radio container */}
    <input
      className={classNames(
        "opacity-0 pointer-events-none absolute top-0 left-0 -z-10 w-full h-full",
        "inline-flex items-center justify-center",
      )}
      type="radio"
      value={value}
      onClick={onClick}
    />

    {/* Label */}
    <span className="text-sm">
      {label}
    </span>
  </label>;
}
