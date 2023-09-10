// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Button } from "antd";
import { useThemeContext } from "@global/theme/ThemeContext.tsx";
import { setStringSetting } from "@utils";
import { BulbOutlined } from "@ant-design/icons";

const debugTheme = localStorage.getItem("debugTheme") === "true";

export function DebugToggleTheme(): JSX.Element | null {
  if (!debugTheme) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { theme } = useThemeContext();

  function onClick() {
    setStringSetting("siteTheme", theme === "light" ? "dark" : "light");
  }

  return <Button onClick={onClick} icon={<BulbOutlined />} />;
}
