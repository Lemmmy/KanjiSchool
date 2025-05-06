// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import React, { useCallback, Ref } from "react";
import { Input, InputProps } from "antd";

import { KANA_MAP } from "./ime-data";
import { InputRef } from "rc-input/es/interface";

export function toKana(s: string): string {
  let start = 0, end = s.length;

  while (start >= 0 && start < end) {
    if (start > 0) {
      const c1 = s.charAt(start - 1);
      const c2 = s.charAt(start);
      if (c1 === "n" && "aiueoyn ".indexOf(c2) < 0) {
        s = s.substring(0, start - 1) + "ん" + s.substring(start);
        continue;
      }
      if (c1 === c2 && "bcdfghjklmpqrstvwxz".indexOf(c1) >= 0) {
        s = s.substring(0, start - 1) + "っ" + s.substring(start);
        continue;
      }
    }

    let found = false;
    for (let i = start - 3; i <= start; i++) {
      if (i < 0) continue;

      const key = s.substring(i, start + 1);
      const replacement = KANA_MAP[key];
      if (replacement) {
        s = s.substring(0, i) + replacement + s.substring(start + 1);
        end -= start + 1 - i;
        end += replacement.length;
        if (end > s.length) end = s.length;
        start = i + replacement.length;
        found = true;
        break;
      }
    }
    if (found) continue;

    if (/\s/.test(s.charAt(start))) {
      s = s.substring(0, start) + s.substring(start + 1);
      end--;
      continue;
    }

    start++;
  }

  return s;
}

interface Props extends InputProps {
  value: string;
  setValue: (value: string) => void;
  inputRef?: Ref<InputRef>;
}

export function PseudoIme({
  value,
  setValue,
  inputRef,
  ...rest
}: Props): React.ReactElement {
  const onChangeInternal = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    const newValue = toKana(inputValue);
    setValue(newValue);
  }, [setValue]);

  return <Input
    value={value}
    onChange={onChangeInternal}
    ref={inputRef}
    {...rest}
  />;
}
