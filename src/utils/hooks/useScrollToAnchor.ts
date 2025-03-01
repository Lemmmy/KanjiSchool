// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactElement, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export function useScrollToAnchor(): void {
  const location = useLocation();
  const lastHash = useRef("");

  useEffect(() => {
    if (location.hash) {
      lastHash.current = location.hash.slice(1);
    }

    if (!lastHash.current) return;

    const el = document.getElementById(lastHash.current);
    if (!el) return;

    el.scrollIntoView({ behavior: "smooth", inline: "nearest" });
    lastHash.current = "";
  }, [location]);
}

export function ScrollToAnchor(): ReactElement | null {
  useScrollToAnchor();
  return null;
}
