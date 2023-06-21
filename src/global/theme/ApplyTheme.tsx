// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect } from "react";

// import "../../style/themes/dark.less";

import { useStringSetting } from "@utils";

export function ApplyTheme(): JSX.Element | null {
  const theme = useStringSetting("siteTheme");

  useEffect(() => {
    //
  }, [theme]);

  return null;
}
