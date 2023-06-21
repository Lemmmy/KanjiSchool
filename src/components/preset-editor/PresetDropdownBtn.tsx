// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { FC, useMemo } from "react";
import { Dropdown, Menu } from "antd";
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
  // User-defined presets
  const userPresets = usePresets(presetType);

  // Preset editor modal open function
  const [openPresetEditor] = usePresetModal();

  const menu = useMemo(() => {
    const defaultPresets = getDefaultPresets(presetType);

    function handleMenuClick({ key }: MenuInfo) {
      // Find the preset's options
      const search = key.startsWith("default-") ? defaultPresets : userPresets;
      const preset = search.find(p => p.uuid === key);
      if (!preset) return;

      // Start the session with the preset options. Parent is responsible for
      // actually calling startSession/gotoSession now.
      start(preset.opts);
    }

    return <Menu onClick={handleMenuClick} className="preset-editor-overlay">
      {/* User-defined presets, if any */}
      {userPresets.length > 0 && <>
        {userPresets.map(p => (
          <Menu.Item key={p.uuid} className="user">
            {p.name || "Unnamed preset"}
          </Menu.Item>
        ))}

        <Menu.Divider />
      </>}

      {/* Then the default presets */}
      {defaultPresets.map(p => (
        <Menu.Item key={p.uuid} className="default">
          {(p.nameNode ?? p.name) || "Unnamed preset"}
        </Menu.Item>
      ))}

      <Menu.Divider />

      <Menu.Item key="editor" className="preset-editor-button"
        onClick={() => openPresetEditor(presetType)}>
        <EditOutlined />Preset editor
      </Menu.Item>
    </Menu>;
  }, [presetType, userPresets, start, openPresetEditor]);

  return <Dropdown.Button
    trigger={CLICK_TRIGGER}

    // Redirect `onClick` to `start` but can be overridden by parent
    onClick={() => start()} // Start with no opts at all (regular button click)

    {...props}

    // Always use our overlay, not parent's
    overlay={menu}
  >
    {children}
  </Dropdown.Button>;
};
