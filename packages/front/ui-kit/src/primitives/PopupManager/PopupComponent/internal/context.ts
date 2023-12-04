import React from "react";
import { Instance } from "@popperjs/core";

import type { VisibilityManagerContextInterface } from "primitives/VisibilityManager/context";

export interface PopupComponentInternalContextStateInterface {
  width: number | null;
  triggerHTMLNode: HTMLElement | null;
  popper?: Instance;
  initializePopupRef: React.Ref<HTMLDivElement>;
  context: VisibilityManagerContextInterface;
  recalculatePopupWidth: () => void;
}

export const PopupComponentInternalContextState = React.createContext<PopupComponentInternalContextStateInterface>(
  null!,
);
