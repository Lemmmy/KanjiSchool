import { useEffect } from "react";
import Debug from "debug";
const debug = Debug("kanjischool:use-prevent-document-space");

const preventSpaceIgnoreEls = new Set(["input", "textarea", "select", "button"]);
export function usePreventDocumentSpace(): void {
  useEffect(() => {
    const preventSpace = (e: KeyboardEvent) => {
      const el = document.activeElement?.tagName?.toLowerCase();
      if (e.key === " " && el && !preventSpaceIgnoreEls.has(el)) {
        debug("space pressed on %o, preventing", el);
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener("keydown", preventSpace);
    return () => document.removeEventListener("keydown", preventSpace);
  }, []);
}
