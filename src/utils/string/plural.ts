// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { nts } from "@utils";

export const plural = (n: number, singularStr: string, pluralStr?: string): string =>
  n === 1 ? singularStr : (pluralStr || singularStr + "s");

export const pluralN = (n: number, singularStr: string, pluralStr?: string): string =>
  nts(n) + " " + plural(n, singularStr, pluralStr);
