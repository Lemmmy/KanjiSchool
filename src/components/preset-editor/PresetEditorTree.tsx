// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Dispatch, ReactNode, SetStateAction, useMemo } from "react";
import { Tree } from "antd";

import { PresetType, Preset, getDefaultPresets, usePresets } from ".";
import { movePreset } from "./move";
import { AntTreeNode } from "antd/lib/tree";
import { DataNode } from "rc-tree/lib/interface";

const TREE_TITLES: Record<PresetType, string> = {
  "lesson": "My lesson presets",
  "review": "My review presets"
};

interface Props {
  presetType: PresetType;
  selectedUuid?: string;
  setSelectedUuid: Dispatch<SetStateAction<string | undefined>>;
}

interface TreeNode {
  key: string;
  title: ReactNode;
  isLeaf?: boolean;
  disabled?: boolean;
  children?: TreeNode[];
}

function presetToTreeNode(preset: Preset): TreeNode {
  return {
    key: preset.uuid,
    title: (preset.nameNode ?? preset.name) || "Unnamed preset",
    isLeaf: true
  };
}

function getTreeData(
  presetType: PresetType,
  userPresets: Preset[]
): TreeNode[] {
  const defaultPresets = getDefaultPresets(presetType);

  return [
    {
      key: "root-user-presets",
      title: TREE_TITLES[presetType],
      children: userPresets.map(presetToTreeNode)
    },
    {
      key: "root-default-presets",
      title: "Built-in presets",
      children: defaultPresets.map(presetToTreeNode)
    }
  ];
}

export function PresetEditorTree({
  presetType,
  selectedUuid,
  setSelectedUuid
}: Props): JSX.Element {
  const userPresets = usePresets(presetType);
  const treeData = useMemo(() => getTreeData(presetType, userPresets),
    [presetType, userPresets]);

  return <Tree
    treeData={treeData}
    blockNode
    defaultExpandAll

    selectable
    selectedKeys={selectedUuid ? [selectedUuid] : undefined}
    onSelect={([k]) => k ? setSelectedUuid(k.toString()) : undefined}

    // Only allow dragging of user presets
    draggable={{
      icon: false,
      nodeDraggable: (({ key }: { key: string }) =>
        !(key.toString()).startsWith("default-")
        && !(key.toString()).startsWith("root-")
      ) as unknown as (node: DataNode) => boolean
    }}

    onDrop={({ dragNode, dropToGap, dropPosition, node }) => {
      // Don't allow dropping onto other nodes or outside of the root
      // TODO: enforce this visually
      if (!dropToGap || (node && (node.key.toString()).startsWith("root-"))) {
        return;
      }

      // TODO: this is broken when dragging downwards
      movePreset(presetType, dragNode.key.toString(), dropPosition);

      return;
    }}
  />;
}
