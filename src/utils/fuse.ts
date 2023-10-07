// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import type Fuse from "fuse.js";
import { useEffect, useState } from "react";

export function useFuseClass(): typeof Fuse | undefined {
  const [fuseClass, setFuseClass] = useState<[typeof Fuse]>();

  // Dynamically import Fuse. TODO: This sucks
  useEffect(() => {
    import("fuse.js")
      .then(m => setFuseClass([m.default]))
      .catch(err => console.error("Failed to load Fuse", err));
  }, []);

  return fuseClass?.[0];
}
