// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";

export const menuItemSettingInner = "py-xs";

export const menuItemClass = classNames(
  "!min-h-auto !h-auto !leading-normal !rounded-none !mli-0 !w-full !overflow-visible !block",
  "border-0 border-solid border-b border-b-split first:border-t first:border-t-split",
  "[&>.ant-menu-title-content]:block [&>.ant-menu-title-content]:!shrink-0",
  "!pli-sm md:!pis-[48px] md:!pie-md",
  "!whitespace-normal",
);

export const menuClass = classNames(
  "border-solid border-split !border rounded py-xss",

  // Make the menu full-width on mobile
  "w-[calc(100vw+16px)] md:w-full -mx-md md:mx-0",

  // antd 5 makes links in menus inherit the color of the menu text, so override that back to their original behavior
  "[&_a]:!text-primary [&_a:hover]:!text-blue-8",
  // and gives all links a pseudo-element encompassing the entire menu item, so get rid of that too
  "[&_a:before]:!content-none",
);
