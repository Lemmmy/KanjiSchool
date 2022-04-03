// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Dropdown, Menu } from "antd";
import { DownOutlined } from "@ant-design/icons";

import { ConditionalLink } from "@comp/ConditionalLink";

export function ItemsDropdown(): JSX.Element {
  return <Dropdown
    trigger={["click"]}
    overlayClassName="site-header-dropdown-overlay site-header-items-dropdown-menu"
    overlay={<Menu>
      <Menu.Item key="all-items">
        <ConditionalLink to="/items/wk" matchTo aria-label="All items">
          All items
        </ConditionalLink>
      </Menu.Item>

      <Menu.Item key="jlpt">
        <ConditionalLink to="/items/jlpt" matchTo aria-label="JLPT kanji">
          JLPT kanji
        </ConditionalLink>
      </Menu.Item>

      <Menu.Item key="joyo">
        <ConditionalLink to="/items/joyo" matchTo aria-label="Jōyō kanji">
        Jōyō kanji
        </ConditionalLink>
      </Menu.Item>

      <Menu.Item key="freq">
        <ConditionalLink to="/items/freq" matchTo aria-label="Newspaper frequency">
          Newspaper frequency
        </ConditionalLink>
      </Menu.Item>
    </Menu>}
  >
    <div className="ant-dropdown-link site-header-element">
      Items <DownOutlined />
    </div>
  </Dropdown>;
}
