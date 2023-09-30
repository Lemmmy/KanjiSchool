// Copyright (c) 2023 Drew Edwards
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
  return <div className={classNames(
    "min-w-[300px] w-full mt-lg mb-32 md:mb-0 flex flex-col gap-md mx-auto",
    className
  )}>
    <TopRow withThemeToggle={withThemeToggle} />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-desc justify-center">
      <LeftCol />
      <RightCol />
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

function LeftCol() {
  return <div className="text-justify">
    All lesson content and audio clips are obtained from <Link href="https://www.wanikani.com/">WaniKani</Link>,
    copyright &copy; <Link href="https://www.tofugu.com">Tofugu LLC</Link>, made available by your WaniKani
    subscription.

    <br /><br />

    KanjiSchool is not affiliated with WaniKani or Tofugu LLC.
  </div>;
}

function RightCol() {
  return <div className="text-justify">
    Kanji data including JLPT level, Jōyō grade and newspaper frequency is collected
    from <Link href="https://jisho.org/">Jisho</Link>, which obtained the majority of this data from
    the <Link href="https://www.edrdg.org/wiki/index.php/KANJIDIC_Project">KANJIDIC project</Link>. This data is
    copyright &copy; the <Link href="https://www.edrdg.org/">Electronic Dictionary Research and Development
    Group</Link>.
  </div>;
}

const Separator = () => <span className="text-desc-c/35">&middot;</span>;

const Link = ({ href, children }: { href: string; children: ReactNode }) => (
  <ExtLink href={href} className="text-desc-c/75 hover:text-blue-4 light:hover:text-blue-6">
    {children}
  </ExtLink>
);
