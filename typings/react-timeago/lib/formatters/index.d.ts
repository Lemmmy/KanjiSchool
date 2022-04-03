// TODO: PR this to DefinitelyTyped

// Based off of the Flow types:
// https://github.com/nmn/react-timeago/blob/master/src/formatters/buildFormatter.js

type Unit =
  | "second"
  | "minute"
  | "hour"
  | "day"
  | "week"
  | "month"
  | "year";

type Suffix = "ago" | "from now";

type Formatter = (
  value: number,
  unit: Unit,
  suffix: Suffix,
  epochMiliseconds: number,
  nextFormatter?: Formatter
) => React.ReactNode;

type StringOrFn = string | ((value: number, millisDelta: number) => string);
type NumberArray = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

interface L10nsStrings {
  prefixAgo?: StringOrFn;
  prefixFromNow?: StringOrFn;
  suffixAgo?: StringOrFn;
  suffixFromNow?: StringOrFn;
  second?: StringOrFn;
  seconds?: StringOrFn;
  minute?: StringOrFn;
  minutes?: StringOrFn;
  hour?: StringOrFn;
  hours?: StringOrFn;
  day?: StringOrFn;
  days?: StringOrFn;
  week?: StringOrFn;
  weeks?: StringOrFn;
  month?: StringOrFn;
  months?: StringOrFn;
  year?: StringOrFn;
  years?: StringOrFn;
  wordSeparator?: string;
  numbers?: NumberArray;
}

declare module "react-timeago/lib/language-strings/*" {
  const strings: L10nsStrings;
  export default strings;
}

declare module "react-timeago/lib/formatters/*" {
  export default function buildFormatter(strings: L10nsStrings): Formatter;
}
