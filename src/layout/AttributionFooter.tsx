// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { Button } from "antd";
import classNames from "classnames";

import { ExtLink } from "@comp/ExtLink";
import { useThemeContext } from "@global/theme/ThemeContext.tsx";
import { setStringSetting } from "@utils";

interface Props {
  withThemeToggle?: boolean;
  className?: string;
}

export function AttributionFooter({
  withThemeToggle = false,
  className
}: Props): JSX.Element {
  const colClass = "text-justify [text-align-last:center]";

  return <div className={classNames(
    "min-w-[300px] w-full my-lg md:mb-0 flex flex-col gap-md mx-auto",
    className
  )}>
    <TopRow withThemeToggle={withThemeToggle} />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-lg text-desc justify-center">
      <div className={colClass}><WaniKaniAttribution /></div>
      <div className={colClass}><JishoAttribution /></div>
      <div className={colClass}><KanjiumAttribution /></div>
    </div>
  </div>;
}

function TopRow({ withThemeToggle }: Props) {
  const { theme } = useThemeContext();

  function toggleTheme() {
    setStringSetting("siteTheme", theme === "light" ? "dark" : "light");
  }

  return <div className="flex flex-wrap items-center justify-center gap-sm text-desc">
    {/* Attribution */}
    <span>
      KanjiSchool is a project by <Link href="https://lemmmy.me">Lemmmy</Link>
    </span>

    <Separator />

    {/* GitHub */}
    <Link href="https://github.com/Lemmmy/KanjiSchool">GitHub</Link>

    {/* Theme toggle */}
    {withThemeToggle && <>
      <Separator />

      <Button type="link" onClick={toggleTheme} className="px-0 text-desc-c/75">
        {theme === "light" ? "Dark" : "Light"} theme
      </Button>
    </>}
  </div>;
}

const WaniKaniAttribution = () => <>
  Lesson content and audio clips are obtained from <Link href="https://www.wanikani.com/">WaniKani</Link>, copyright
  &copy; <Link href="https://www.tofugu.com">Tofugu LLC</Link>, made available by your WaniKani subscription. KanjiSchool
  is not affiliated Tofugu LLC.
</>;

const JishoAttribution = () => <>
  Kanji data including JLPT level, Jōyō grade, and newspaper frequency is collected
  from <Link href="https://jisho.org/">Jisho</Link>, which obtained most of its data from
  the <Link href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project">KANJIDIC</Link> project, copyright &copy;
  the <Link href="https://www.edrdg.org/">EDRDG</Link>.
</>;

export const KanjiumAttribution = (): JSX.Element => <>
  Pitch accent data is obtained from the <Link href="https://github.com/mifunetoshiro/kanjium">Kanjium</Link> project,
  licensed under the <Link href="https://creativecommons.org/licenses/by-sa/4.0/">CC BY-SA 4.0</Link> license, provided
  by Uros O. through his free database.
</>;

const Separator = () => <span className="text-desc-c/35">&middot;</span>;

const Link = ({ href, children }: { href: string; children: ReactNode }) => (
  <ExtLink href={href} className="text-desc-c/75 hover:text-blue-4 light:hover:text-blue-6">
    {children}
  </ExtLink>
);
