// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button, Space } from "antd";

import { ExtLink } from "@comp/ExtLink";
import { useThemeContext } from "@global/theme/ThemeContext.tsx";
import { setStringSetting } from "@utils";

const Separator = () => <span className="text-desc-c/35">&middot;</span>;

export function LoginFooter(): JSX.Element {
  const { theme } = useThemeContext();

  function toggleTheme() {
    setStringSetting("siteTheme", theme === "light" ? "dark" : "light");
  }

  return <Space
    align="center"
    wrap
    className="min-w-[300px] w-full max-w-sm mt-lg mb-32 md:mb-0 justify-center text-desc"
  >
    {/* Theme toggle */}
    <Button type="link" onClick={toggleTheme} className="px-0 text-desc-c/75">
      {theme === "light" ? "Dark" : "Light"} theme
    </Button>

    <Separator />

    {/* GitHub */}
    <ExtLink href="https://github.com/Lemmmy/KanjiSchool" className="text-desc-c/75">
      GitHub
    </ExtLink>

    <Separator />

    {/* Attribution */}
    <span>
      Created by <ExtLink href="https://lemmmy.me" className="text-desc-c/75">Lemmmy</ExtLink>
    </span>
  </Space>;
}
