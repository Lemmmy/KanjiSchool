// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FC, useCallback, useMemo } from "react";
import { Dropdown, MenuProps } from "antd";
import { DropdownButtonProps } from "antd/lib/dropdown";
import { EditOutlined } from "@ant-design/icons";

import { SessionOpts } from "@session/order/options";
import { PresetType, usePresets, getDefaultPresets, usePresetModal } from ".";

import { MenuInfo } from "@utils";

export type PresetStartSessionFn = (opts?: Partial<SessionOpts>) => void;

interface Props extends Omit<DropdownButtonProps, "overlay"> {
  presetType: PresetType;
  start: PresetStartSessionFn;
}

const CLICK_TRIGGER: "click"[] = ["click"];

export const PresetDropdownBtn: FC<Props> = ({
  presetType,
  start,
  children,
  ...props
}) => {
  // Preset editor modal open function
  const [openPresetEditor] = usePresetModal();

  const defaultPresets = useMemo(() => getDefaultPresets(presetType), [presetType]);
  const userPresets = usePresets(presetType);

  const handleMenuClick = useCallback(({ key }: MenuInfo) => {
    // Find the options for the preset
    const search = key.startsWith("default-") ? defaultPresets : userPresets;
    const preset = search.find(p => p.uuid === key);
    if (!preset) return;

    // Start the session with the preset options. Parent is responsible for
    // actually calling startSession/gotoSession now.
    start(preset.opts);
  }, [defaultPresets, userPresets, start]);

  const menu: MenuProps = useMemo(() => {
    const items: MenuProps["items"] = [];

    // User-defined presets, if any
    if (userPresets.length > 0) {
      for (const p of userPresets) {
        items.push({
          key: p.uuid,
          label: p.nameNode || p.name || "Unnamed preset"
        });
      }

      items.push({ type: "divider" });
    }

    // Then the default presets
    for (const p of defaultPresets) {
      items.push({
        key: p.uuid,
        label: p.nameNode || p.name || "Unnamed preset"
      });
    }

    items.push({ type: "divider" });

    // Preset editor
    items.push({
      key: "editor",
      icon: <EditOutlined />,
      label: "Preset editor",
      onClick: () => openPresetEditor(presetType)
    });

    return {
      items,
      onClick: handleMenuClick
    };
  }, [presetType, handleMenuClick, userPresets, defaultPresets, openPresetEditor]);

  return <Dropdown.Button
    trigger={CLICK_TRIGGER}

    // Redirect `onClick` to `start` but can be overridden by parent
    onClick={() => start()} // Start with no opts at all (regular button click)

    {...props}

    // Always use our overlay, not parent's
    menu={menu}
  >
    {children}
  </Dropdown.Button>;
};
