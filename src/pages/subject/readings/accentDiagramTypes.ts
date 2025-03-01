// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

/**
 * | https://www.patreon.com/posts/japanese-episode-35173952
 * | https://lemmmy.s-ul.eu/fXv47zJS.png
 * | Hi, Drew. JP here, Dōgen's business partner. I'm helping manage the messages here on Patreon.
 * |
 * | I can't find anything in English talking about the notation styles, but there are pages in Japanese that list and
 * | name different notation styles.
 * |
 * | One paper (available here: https://atomi.repo.nii.ac.jp/records/1417) gives 音階式 for the circles-with-lines
 * | style. The paper and this site (https://www.akenotsuki.com/kyookotoba/accent/iroiro.html) both give 線式 for the
 * | second notation style, and 丸式 for the third style shown at 0:55. One other page
 * | (https://forgetmenots.doorblog.jp/archives/55259515.html) that gives a few notations not cited in the paper or the
 * | above page.
 * |
 * | The akenotsuki.com page in particular has a pretty easy to read table with examples and a brief overview of each
 * | style, including characteristics of each.
 * |
 * | You can find more resources if you search for アクセントの表記法 or 高低アクセント書き方. Hope this helps!
 */
export type AccentDiagramStyle =
  "onkai-shiki" | // 音階式 - "Scale style" - dots with lines
  "sen-shiki";    // 線式   - "Line style"  - lines only
