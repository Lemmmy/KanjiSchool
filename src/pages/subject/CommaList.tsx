// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { ReactNode } from "react";
import classNames from "classnames";

type CommaListValue = [string, boolean] | [string, boolean, ReactNode];

interface CommaListProps {
  type: "meaning" | "reading" | string;
  values?: CommaListValue[];
  alwaysBoldPrimary?: boolean;
  className?: string;
}

export function CommaList({
  values,
  type,
  alwaysBoldPrimary,
  className
}: CommaListProps): JSX.Element | null {
  const noBold = !alwaysBoldPrimary && values && values.length <= 1;

  return values && values.length
    ? <div className={className}>
      {values.map(([value, primary, node], id, arr) => {
        // Bold the primary values, only if there are more than one
        const classes = classNames(type, {
          "font-bold": !noBold && primary
        });

        return <React.Fragment key={value}>
          {/* Individual meaning/reading, bold if primary */}
          <span className={classes}>{node ?? value}</span>
          {/* Add a comma if this is not the last value */}
          {id < arr.length - 1 && <>,&nbsp;</>}
        </React.Fragment>;
      })}
    </div>
    : null;
}
