// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

export const uppercaseFirst = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const kebabCase = (str: string): string =>
  str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/([a-z])(\d+)/g, "$1-$2")
    .toLowerCase();

