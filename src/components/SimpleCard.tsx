// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

// Replacement for ant-design's Card component that doesn't pull in large subcomponents such as Tabs.

import { forwardRef, HTMLProps, ReactNode } from "react";
import classNames from "classnames";

import { SimpleSkeleton } from "@comp/SimpleSkeleton.tsx";

interface Props extends Omit<HTMLProps<HTMLDivElement>, "title"> {
  title?: ReactNode;
  extra?: ReactNode;
  loading?: boolean;
  flush?: boolean;
  className?: string;
  bodyClassName?: string;
  headClassName?: string;
  children?: ReactNode;
}

export const SimpleCard = forwardRef<HTMLDivElement, Props>(function SimpleCard({
  title,
  extra,
  loading,
  flush,
  className,
  bodyClassName,
  headClassName,
  children,
  ...rest
}, ref): JSX.Element {
  return <div
    className={classNames(
      "wk-card rounded-lg leading-ant bg-[#141414] light:bg-white",
      "border border-solid border-[#303030] light:border-[#e0e0e0]",
      className
    )}
    ref={ref}
    {...rest}
  >
    {/* Header */}
    {(title || extra) && <div
      className={classNames(
        "wk-card-head flex items-center justify-between px-lg min-h-[58px]",
        "border-bottom border-solid border-0 border-b border-[#303030] light:border-[#e0e0e0]",
        headClassName
      )}
    >
      {/* Title */}
      <div className="text-lg font-semibold">{title}</div>

      {/* Extra */}
      {extra && <div>{extra}</div>}
    </div>}

    {/* Body */}
    <div className={classNames(
      "wk-card-body",
      bodyClassName,
      {
        "p-lg": !flush
      }
    )}>
      {loading
        ? <SimpleSkeleton />
        : children}
    </div>
  </div>;
});
