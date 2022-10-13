import { usePrefersReducedMotion } from "@anatoliygatt/use-prefers-reduced-motion";
import { useBooleanSetting } from "@utils";

export function useReducedMotion(): boolean {
  const browserPreference = usePrefersReducedMotion();
  const settingPreference = useBooleanSetting("preferReducedMotion");
  return browserPreference || settingPreference;
}
