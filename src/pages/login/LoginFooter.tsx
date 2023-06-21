// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Space } from "antd";

import { ExtLink } from "@comp/ExtLink";

export function LoginFooter(): JSX.Element {
  return <Space align="center" wrap className="login-page-footer">
    <ExtLink href="https://github.com/Lemmmy/KanjiSchool">GitHub</ExtLink>
    <span className="sep">&middot;</span>
    <span>
      Created by <ExtLink href="https://lemmmy.me">Lemmmy</ExtLink>
    </span>
  </Space>;
}
