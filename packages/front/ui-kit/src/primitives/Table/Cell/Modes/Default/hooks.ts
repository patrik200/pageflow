import React from "react";
import { useMeasure } from "@worksolutions/react-utils";

export function useAutoHeight(disable: boolean) {
  const [setElement, measure, , tdElement] = useMeasure();

  React.useEffect(() => {
    if (disable || !tdElement || measure.height === 0) return;
    const child = tdElement.children[0] as HTMLElement | undefined;
    if (!child) return;
    // child.style.height = measure.height - 1 + "px";
  }, [disable, measure, tdElement]);

  return setElement;
}
