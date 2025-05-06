// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReducedMotionClass } from "@global/ReducedMotionClass.tsx";
import { ApplyWkTheme } from "@global/theme";
import { ApplyAntThemeVariables } from "@global/theme/ApplyAntThemeVariables.tsx";

export function AppServices(): React.ReactElement {
  return <>
    <ReducedMotionClass />
    <ApplyWkTheme />
    <ApplyAntThemeVariables />
  </>;
}
