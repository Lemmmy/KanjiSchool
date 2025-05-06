import { useBodyClass } from "@utils/hooks/useBodyClass";
import { useReducedMotion } from "@utils";

export function ReducedMotionClass(): React.ReactElement | null {
  const reducedMotion = useReducedMotion();
  useBodyClass({ "reduced-motion": reducedMotion });
  return null;
}
