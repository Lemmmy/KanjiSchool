// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import TimeAgo from "react-timeago";
import enShort from "react-timeago/lib/language-strings/en-short";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

const formatter = buildFormatter(enShort);

interface Props {
  date: Date | string | number;
}

export function ShortDuration({ date }: Props): JSX.Element {
  return <TimeAgo date={date} formatter={formatter} />;
}
