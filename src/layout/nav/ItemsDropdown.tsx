// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Dropdown, MenuProps } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { ConditionalLink } from "@comp/ConditionalLink";
import { headerElementClass, dropdownOverlayClass } from "./AppHeader.tsx";

const menu: MenuProps = {
  items: [{
    key: "all-items",
    label: <ConditionalLink to="/items/wk" matchTo aria-label="All items">
      All items
    </ConditionalLink>
  }, {
    key: "jlpt",
    label: <ConditionalLink to="/items/jlpt" matchTo aria-label="JLPT kanji">
      JLPT kanji
    </ConditionalLink>
  }, {
    key: "joyo",
    label: <ConditionalLink to="/items/joyo" matchTo aria-label="Jōyō kanji">
      Jōyō kanji
    </ConditionalLink>
  }, {
    key: "freq",
    label: <ConditionalLink to="/items/frequency" matchTo aria-label="Newspaper frequency">
      Newspaper frequency
    </ConditionalLink>
  }]
};

export function ItemsDropdown(): React.ReactElement {
  return <Dropdown
    trigger={["click"]}
    overlayClassName={dropdownOverlayClass}
    menu={menu}
  >
    <div className={headerElementClass}> {/* ant-dropdown-link */}
      Items <DownOutlined className="hidden lg:inline-block text-xss ml-md" />
    </div>
  </Dropdown>;
}
