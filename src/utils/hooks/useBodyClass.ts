import { useEffect } from "react";
import classNames, { Argument } from "classnames";

export function useBodyClass(...names: Argument[]) {
  const className = classNames(...names);

  useEffect(() => {
    if (className) document.body.classList.add(className);
    return () => {
      if (className) document.body.classList.remove(className);
    };
  }, [className]);
}
