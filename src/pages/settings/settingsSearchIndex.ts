// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { MenuItem } from "./components/SettingsSubGroup.tsx";
import { menuItems } from "./SettingsItems.tsx";

import { onlyText } from "react-children-utilities";

import type Fuse from "fuse.js";
import { ReactNode } from "react";

export interface IndexedSetting {
  path: string;
  text: string;
  index: number;
}

type IndexedSettingsMap = Record<string, IndexedSetting>;

export interface SettingsIndex {
  fuse: Fuse<IndexedSetting>;
  indexedSettings: IndexedSettingsMap;
}

export function indexSettings(fuseClass: typeof Fuse | undefined): SettingsIndex | null {
  if (!fuseClass) return null;

  // Index the submenu items - convert all their children to text using react-children-utilities, then construct a
  // list of all the text with the item's path
  const items: Record<string, IndexedSetting> = {};
  menuItems.forEach(item => processItem("", item, items, [0]));

  const fuse = new fuseClass(Object.values(items), {
    keys: ["path", "text"],
    findAllMatches: true,
    minMatchCharLength: 3,
    threshold: 0.4,
  });

  return { fuse, indexedSettings: items };
}

function processItem(rootKey: string, item: MenuItem, items: IndexedSettingsMap, indexCounter: [number]) {
  if (!item) return;

  if (!("type" in item) || item.type !== "group") {
    const path = `${rootKey}.${item.key}`;
    const text = "label" in item ? makeItemText(item.label) : `${item.key}`;
    items[path] = {
      path,
      text,
      index: indexCounter[0]++,
    };
  }

  if ("children" in item && Array.isArray(item.children)) {
    item.children.forEach(c => processItem(`${rootKey}.${item?.key}`, c, items, indexCounter));
  }
}

function makeItemText(label: ReactNode): string {
  if (!label) return "";
  if (typeof label === "string") return label;

  const whatever = (label as any)?.props;

  const text = [];
  if ("title" in whatever) text.push(onlyText(whatever.title));
  if ("description" in whatever) text.push(onlyText(whatever.description));
  text.push(onlyText(whatever.children));

  return text.filter(t => t).join(" ");
}

export function getChildByPath(children: MenuItem[], remainingKey: string): MenuItem | undefined {
  const keyPart = remainingKey.split(".", 1)[0];

  const child = children.find(c => c?.key === keyPart);
  if (!child) return undefined;

  if (remainingKey.indexOf(".") === -1) return child;
  if (!("children" in child) || !Array.isArray(child.children)) return undefined;

  return getChildByPath(child.children, remainingKey.slice(keyPart.length + 1));
}

export function itemWithoutChildren(item: MenuItem): MenuItem {
  if (!item || !("children" in item)) return item;
  const { children, ...rest } = item;
  return rest;
}
