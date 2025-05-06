// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ExtLink } from "@comp/ExtLink.tsx";

import { RandomFontCredits } from "./RandomFontCredits.tsx";
import { RandomFontForm } from "./RandomFontForm.tsx";
import { Check } from "./Check.tsx";

import { useBooleanSetting } from "@utils";

export function RandomFontList(): React.ReactElement {
  const baseClass = "leading-normal py-md whitespace-normal";

  const enabled = useBooleanSetting("randomFontEnabled");
  if (!enabled) {
    return <div className={baseClass}>
      <RandomFontCredits enabled={false} />
    </div>;
  }

  return <div className={baseClass}>
    <RandomFontCredits enabled={true} />

    <p className="mt-sm">
      Fonts supported by your system are shown with a green checkmark <Check />. The default list of fonts is based
      on <ExtLink href="https://gist.github.com/obskyr/9f3c77cf6bf663792c6e">this list</ExtLink>, and more fonts can be
      found at <ExtLink href="https://freejapanesefont.com">freejapanesefont.com</ExtLink>.
    </p>

    <RandomFontForm />
  </div>;
}
