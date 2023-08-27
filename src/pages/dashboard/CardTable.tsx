// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import classNames from "classnames";
import { ReactNode } from "react";
import { nts } from "@utils";

interface CardTableProps {
  headers: string[];
  children?: ReactNode;
}

const cellClass = "py-xss px-sm text-sm border-solid border border-split first:w-[20%] first:text-left " +
  "xxl:text-base xxl:py-xs xxl:px-md";

export function CardTable({
  headers,
  children
}: CardTableProps): JSX.Element {
  return <table className="w-[calc(100%+2px)] m-[-1px] mt-0 overflow-auto border-collapse border-spacing-0">
    <thead className="bg-white/8">
      <tr className="text-sm text-desc">
        {headers.map((h, i) => (
          <th key={i} className={classNames(cellClass, "font-normal")}>
            {i === 0 ? <b>{h}</b> : h}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {children}
    </tbody>
  </table>;
}

interface CardTableRowProps {
  onClick?: () => void;
  className?: string;
  clickable?: boolean;
  highlight?: boolean;
  burned?: boolean;
  children?: ReactNode;
}

export function CardTableRow({
  onClick,
  className,
  clickable,
  highlight,
  burned,
  children
}: CardTableRowProps): JSX.Element {
  return <tr
    onClick={onClick}
    className={classNames("transition-colors [&_td:first-child]:transition-colors", className, {
      "cursor-pointer": clickable,
      ["color-lime bg-lime-9/50 [&_td:first-child]:bg-lime-8/50 hover:bg-lime-8/50 " +
        "[&:hover_td:first-child]:bg-lime-8/75"]: highlight,
      ["color-green bg-green-9/50 [&_td:first-child]:bg-green-8/50 hover:bg-green-8/50 " +
        "[&:hover_td:first-child]:bg-green-8/75"]: burned,
      "hover:bg-white/4 [&:hover_td:first-child]:bg-white/8": !highlight && !burned && clickable
    })}
  >
    {children}
  </tr>;
}

export interface CardTableCellProps {
  className?: string;
  highlight?: boolean;
  burned?: boolean;
  zeroClass?: string;
  children?: ReactNode | number;
}

export function CardTableCell({
  className,
  highlight,
  burned,
  zeroClass = highlight
    ? "!text-lime/50"
    : burned
      ? "!text-green/50"
      : "!text-desc",
  children
}: CardTableCellProps): JSX.Element {
  return <td
    className={classNames(
      cellClass,
      className,
      "text-right first:bg-white/4",
      {
        [zeroClass]: children === 0
      }
    )}
  >
    {typeof children === "number" ? nts(children) : children}
  </td>;
}
