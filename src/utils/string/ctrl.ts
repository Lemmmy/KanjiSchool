// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

/** Returns the ⌘ (command) symbol on macOS, and "Ctrl" everywhere else. */
export const ctrl = /mac/i.test(navigator.platform) ? "\u2318" : "Ctrl";
