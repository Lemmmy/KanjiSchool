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
}

export function CommaList({
  values,
  type,
  alwaysBoldPrimary
}: CommaListProps): JSX.Element | null {
  const noBold = !alwaysBoldPrimary && values && values.length <= 1;

  return values && values.length
    ? <div className={`comma-list subject-info-${type}s`}>
      {values.map(([value, primary, node], id, arr) => {
        // Bold the primary values, only if there are more than one
        const classes = classNames(type, {
          "primary": !noBold && primary
        });

        return <React.Fragment key={value}>
          {/* Individual meaning/reading, bold if primary */}
          <span className={classes}>{node ?? value}</span>
          {/* Add a comma if this is not the last value */}
          {id < arr.length - 1 && <span className="comma">,&nbsp;</span>}
        </React.Fragment>;
      })}
    </div>
    : null;
}
