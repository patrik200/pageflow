import React from "react";
import { useVanillaPopper, VanillaPopperOptions } from "@worksolutions/react-utils";

import VisibilityManager, {
  VisibilityManagerContext,
  VisibilityManagerContextInterface,
} from "primitives/VisibilityManager";

import { CommonPopupManagerPropInterface } from "../types";

import { PopupComponentInternalContextState, PopupComponentInternalContextStateInterface } from "../../PopupComponent";
import { useModifiers } from "../../libs";

export interface PopupManagerForExternalInterface extends CommonPopupManagerPropInterface {
  opened: boolean;
}

function PopupManagerForExternal({
  opened,
  triggerElement,
  disabled,
  primaryPlacement,
  offset,
  maxHeight,
  popupElement,
  triggerHTMLNode,
  strategy,
  width,
  recalculatePopupWidth,
  onVisibilityChange,
}: PopupManagerForExternalInterface) {
  const [context, setContext] = React.useState<VisibilityManagerContextInterface | null>(null);
  const [popupHTMLNode, setPopupHTMLNode] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!context || disabled || !triggerHTMLNode) return;
    if (opened) {
      context.show();
    } else {
      context.hide();
    }
  }, [context, disabled, opened, popupHTMLNode, triggerHTMLNode]);

  const modifiers = useModifiers(offset, maxHeight);

  const popperOptions = React.useMemo<VanillaPopperOptions>(
    () => ({ placement: primaryPlacement, modifiers, strategy }),
    [modifiers, primaryPlacement, strategy],
  );
  const popper = useVanillaPopper(triggerHTMLNode, popupHTMLNode, popperOptions);

  const contextState = React.useMemo<PopupComponentInternalContextStateInterface>(
    () => ({
      popper,
      triggerHTMLNode,
      width,
      initializePopupRef: setPopupHTMLNode,
      context: context!,
      recalculatePopupWidth,
    }),
    [context, popper, recalculatePopupWidth, triggerHTMLNode, width],
  );

  return (
    <PopupComponentInternalContextState.Provider value={contextState}>
      <VisibilityManager ref={setContext} closeOnClickOutside={false} onVisibilityChange={onVisibilityChange}>
        {triggerElement}
      </VisibilityManager>
      {context && <VisibilityManagerContext.Provider value={context}>{popupElement}</VisibilityManagerContext.Provider>}
    </PopupComponentInternalContextState.Provider>
  );
}

export default React.memo(PopupManagerForExternal);
