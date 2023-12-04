import React from "react";
import { isArray } from "@worksolutions/utils";
import popperMaxSizeModifier from "popper-max-size-modifier";
import type { Modifier } from "@popperjs/core";

export function getPopupWidth(triggerElementWidth?: number, popupWidth?: "full" | "auto") {
  if (!triggerElementWidth || !popupWidth) return null;
  if (popupWidth === "auto") return null;
  return triggerElementWidth;
}

export type PopupManagerModifierOffset = number | [number, number];

export function useModifiers(offset: PopupManagerModifierOffset = 4, maxHeight?: number | false) {
  const maxHeightCalculator = React.useMemo(() => {
    if (maxHeight === undefined) return (height: number) => `${height - 16}px`;
    if (maxHeight === false) return () => "";
    return (height: number) => `${Math.min(maxHeight, height - 16)}px`;
  }, [maxHeight]);

  return React.useMemo<Partial<Modifier<any, any>>[]>(
    () => [
      { name: "computeStyles", options: { adaptive: false } },
      { name: "flip", enabled: true },
      { name: "offset", options: { offset: isArray(offset) ? offset : [0, offset] } },
      popperMaxSizeModifier,
      {
        name: "applyMaxSize",
        enabled: maxHeight !== false,
        phase: "beforeWrite",
        requires: ["maxSize"],
        fn({ state }) {
          const { height } = state.modifiersData.maxSize;
          state.styles.popper.maxHeight = maxHeightCalculator(height);
        },
      },
    ],
    [maxHeight, maxHeightCalculator, offset],
  );
}
