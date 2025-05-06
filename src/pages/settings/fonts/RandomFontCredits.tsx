// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ExtLink } from "@comp/ExtLink.tsx";

export function RandomFontCredits({ enabled }: { enabled: boolean }): React.ReactElement {
  return <div>
    Random Fonts is based on the
    fantastic <ExtLink href="https://community.wanikani.com/t/jitai-%E5%AD%97%E4%BD%93-the-font-randomizer-that-fits/12617">Jitai</ExtLink> userscript.
    {!enabled && <> Enable to see the full list of fonts.</>}
  </div>;
}
