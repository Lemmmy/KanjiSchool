// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Space } from "antd";

import { ExtLink } from "@comp/ExtLink";

export function LoginFooter(): JSX.Element {
  return <Space
    align="center"
    wrap
    className="min-w-[320px] w-full max-w-sm mt-lg mb-md md:mb-0 justify-center text-desc-c/75"
  >
    <ExtLink href="https://github.com/Lemmmy/KanjiSchool" className="text-desc">
      GitHub
    </ExtLink>
    <span className="text-desc-c/35">&middot;</span>
    <span>
      Created by <ExtLink href="https://lemmmy.me" className="text-desc">Lemmmy</ExtLink>
    </span>
  </Space>;
}
