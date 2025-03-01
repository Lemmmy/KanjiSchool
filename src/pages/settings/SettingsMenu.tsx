// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo, useState } from "react";
import { Input, Menu, MenuProps } from "antd";

import { menuItems } from "./SettingsItems.tsx";
import { menuClass } from "./components/settingsStyles.ts";
import { MenuItem } from "./components/SettingsSubGroup.tsx";
import { getChildByPath, indexSettings, itemWithoutChildren } from "./settingsSearchIndex.ts";
import { useFuseClass } from "@utils/fuse.ts";

interface FilteredGroup {
  self: MenuItem;
  index: number;
  children: (MenuItem & { index: number })[];
}

export function SettingsMenu(): JSX.Element {
  const fuseClass = useFuseClass();
  const indexer = useMemo(() => indexSettings(fuseClass), [fuseClass]);

  const [search, setSearch] = useState("");

  const items: MenuProps["items"] = useMemo(() => {
    if (!search || !indexer) return menuItems;

    // Filter the menu items by search query
    const searchLower = search.toLowerCase().trim();
    const results = indexer.fuse.search(searchLower);

    // Result items, grouped by their original parent subgroup (ignore root groups for now)
    const resultItemTree: Record<string, FilteredGroup> = {};

    results.forEach(result => {
      const keyPath = result.item.path.slice(1);
      const keyPathParts = keyPath.split(".");
      if (keyPathParts.length < 3) return;

      const parentPath = keyPathParts.slice(0, -1).join(".");

      if (!resultItemTree[parentPath]) {
        const parentItem = getChildByPath(menuItems, parentPath);
        if (!parentItem) throw new Error(`Couldn't find parent item for ${keyPath}`);

        resultItemTree[parentPath] = {
          self: itemWithoutChildren(parentItem),
          index: indexer.indexedSettings[`.${parentPath}`].index,
          children: []
        };
      }

      const parent = resultItemTree[parentPath];

      const child = getChildByPath(menuItems, keyPath);
      if (!child) throw new Error(`Couldn't find child item for ${keyPath}`);

      const withoutChildren = itemWithoutChildren(child);
      if (withoutChildren) {
        parent.children.push({
          ...withoutChildren,
          index: indexer.indexedSettings[`.${keyPath}`].index
        });
      }
    });

    // Convert the grouped items back into a flat list
    const groupList = Object.values(resultItemTree).map(group => {
      // Sort the children by their index
      const children = group.children;
      children.sort((a, b) => a.index - b.index);

      return {
        ...group.self,
        index: group.index,
        children
      } as MenuItem & { index: number };
    });

    // Sort the groups by their index
    groupList.sort((a, b) => a.index - b.index);

    return groupList;
  }, [indexer, search]);

  return <>
    <Input.Search
      placeholder="Search settings"
      className="w-full mb-sm"
      size="large"

      loading={!fuseClass}

      value={search}
      onChange={e => setSearch(e.target.value)}
    />

    {items && items.length
      ? (
        <Menu
          mode="inline"
          className={menuClass}
          selectable={false}
          items={items}
        />
      )
      : (
        <div className="text-sm text-desc">
          No settings found
        </div>
      )}
  </>;
}
