// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState } from "react";
import { Button, Modal, Popconfirm } from "antd";
import classNames from "classnames";

import { deletePreset, newPreset, PresetType, savePreset } from ".";
import { PresetEditorTree } from "./PresetEditorTree";
import { usePresetEditorForm } from "./PresetEditorForm";

const MODAL_TITLES: Record<PresetType, string> = {
  "lesson": "Lesson presets",
  "review": "Review presets"
};

interface Props {
  type: PresetType;
  visible: boolean;
  closeFn: () => void;
}

export default function PresetEditorModal({
  type: presetType,
  visible,
  closeFn
}: Props): JSX.Element {
  const [selectedUuid, setSelectedUuid] = useState<string>();
  const isDefault = !selectedUuid
    || selectedUuid.startsWith("default-")
    || selectedUuid.startsWith("root-");

  const [formEl, onSubmit] = usePresetEditorForm(presetType, selectedUuid);

  function onClickNew() {
    const preset = newPreset(presetType);
    savePreset(presetType, preset);
    setSelectedUuid(preset.uuid);
  }

  function onClickDelete() {
    if (isDefault || !selectedUuid) return;
    deletePreset(presetType, selectedUuid);
    setSelectedUuid(undefined);
  }

  return <Modal
    title={MODAL_TITLES[presetType] || "Preset editor"}
    open={visible}
    onCancel={closeFn}

    bodyStyle={{
      display: "flex",
      padding: 0
    }}

    width={900}
    footer={<div className="flex">
      <div className="flex w-[35%] max-w-preset-editor-sidebar mr-lg">
        {/* Delete */}
        <Popconfirm
          title="Are you sure you want to delete this preset?"
          onConfirm={onClickDelete}
          okText="Yes"
          cancelText="No"
          disabled={isDefault}
        >
          <Button danger disabled={isDefault}>Delete</Button>
        </Popconfirm>

        <div className="flex-1" />

        {/* New */}
        <Button onClick={onClickNew}>New</Button>
      </div>

      <div className="w-px -my-[20px] bg-split" />

      <div className="flex-1" />

      <div>
        {/* Close */}
        <Button onClick={closeFn}>Close</Button>

        {/* Save */}
        <Button type="primary" disabled={isDefault} onClick={onSubmit}>
          Save
        </Button>
      </div>
    </div>}
  >
    {/* Sidebar/tree */}
    <div className="w-[35%] max-w-preset-editor-sidebar max-h-preset-editor-height overflow-auto mt-md mr-lg">
      <PresetEditorTree
        presetType={presetType}
        selectedUuid={selectedUuid}
        setSelectedUuid={setSelectedUuid}
      />
    </div>

    <div className="w-px -mt-[53px] mb-[8px] bg-split" />

    <div className="flex-1 max-h-preset-editor-height ml-lg mb-md pt-md pl-md pr-lg overflow-y-auto">
      {/* Only render the form if this is a valid preset (i.e. not a tree
        * root node) */}
      {selectedUuid && !selectedUuid.startsWith("root-") && formEl}
    </div>
  </Modal>;
}
