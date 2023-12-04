import React from "react";
import { useChildrenMeasure } from "@worksolutions/react-utils";

export function useCollapse(opened: boolean) {
  const { initRef, relativeMeasures } = useChildrenMeasure(true);

  const elementHeight = React.useMemo(() => {
    if (!relativeMeasures) return undefined;
    const lastElement = relativeMeasures[relativeMeasures.length - 1];
    return lastElement.y + lastElement.height;
  }, [relativeMeasures]);

  const style = React.useMemo(() => ({ height: opened ? elementHeight : 0 }), [elementHeight, opened]);

  return { initRef, elementHeight, style };
}
