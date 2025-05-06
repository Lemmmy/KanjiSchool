// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { cn } from "@utils";
import { forwardRef, HTMLAttributes, ReactNode } from "react";

export interface KeyboardProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
}

export const Keyboard = forwardRef<HTMLSpanElement, KeyboardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "inline-block text-[90%] whitespace-nowrap px-1.5 py-0.5 leading-tight rounded-sm",
          "bg-white/5 border border-solid border-b-2 border-white/10 font-mono",
          "light:bg-black/5 light:border-black/10",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Keyboard.displayName = "Keyboard";
