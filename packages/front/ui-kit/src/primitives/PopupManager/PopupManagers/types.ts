import React from "react";
import type { Placement, PositioningStrategy } from "@popperjs/core";

import type { PopupManagerModifierOffset } from "../libs";

export interface CommonPopupManagerPropInterface {
  triggerElement: JSX.Element;
  triggerHTMLNode: HTMLElement | null;
  disabled?: boolean;
  primaryPlacement: Placement;
  popupElement: React.ReactNode;
  offset?: PopupManagerModifierOffset;
  maxHeight?: number | false;
  strategy?: PositioningStrategy;
  width: number | null;
  recalculatePopupWidth: () => void;
  onVisibilityChange?: (visible: boolean) => void;
}
