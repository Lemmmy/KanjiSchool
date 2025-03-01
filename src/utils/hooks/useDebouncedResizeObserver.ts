// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useMemo, RefCallback } from "react";
import useResizeObserver from "use-resize-observer";
import { debounce } from "lodash-es";

interface ObservedSize {
  width?: number;
  height?: number;
}
type HookResponse<T extends HTMLElement> = {
  ref: RefCallback<T>;
} & ObservedSize;

export function useDebouncedResizeObserver<T extends HTMLElement>(duration: number): HookResponse<T> {
  const [size, setSize] = useState<ObservedSize>({});
  const onResize = useMemo(() => debounce(setSize, duration, { leading: true }), [duration]);
  const { ref } = useResizeObserver({ onResize });

  return { ref, ...size };
}
