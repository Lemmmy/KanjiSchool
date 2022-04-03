// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

/**
 * Boolean comparison for sorting functions.
 *
 * @returns the value <code>0</code> if <code>x === y </code>;
 *          a value less than <code>0</code> if <code>!x && y</code>; and
 *          a value greater than <code>0</code> if <code>x && !y</code>
 **/
export const booleanCompare = (a: boolean, b: boolean): number =>
  (a === b) ? 0 : (a ? 1 : -1);
