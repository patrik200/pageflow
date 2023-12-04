import React from "react";
import { useSyncToRef, useVanillaPopper, VanillaPopperOptions } from "@worksolutions/react-utils";
import uuid from "uuidjs";

import VisibilityManager, {
  VisibilityManagerContext,
  VisibilityManagerContextInterface,
} from "primitives/VisibilityManager";
import { RenderedInModalContext } from "primitives/Modal";

import { CommonPopupManagerPropInterface } from "../types";

import { handleTriggerElementEventsForClick } from "./libs";
import { PopupComponentInternalContextState, PopupComponentInternalContextStateInterface } from "../../PopupComponent";
import { useModifiers } from "../../libs";

export interface PopupManagerForClickInterface extends CommonPopupManagerPropInterface {
  closeOnClickOutside?: boolean;
  toggleOnClick?: boolean;
}

function PopupManagerForClick({
  toggleOnClick = true,
  closeOnClickOutside,
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
}: PopupManagerForClickInterface) {
  const [context, setContext] = React.useState<VisibilityManagerContextInterface | null>(null);
  const [popupHTMLNode, setPopupHTMLNode] = React.useState<HTMLElement | null>(null);
  const ignoreVisibilityManagerOutsideClickElements = React.useMemo(() => [popupHTMLNode], [popupHTMLNode]);
  const renderedInModal = useSyncToRef(React.useContext(RenderedInModalContext));

  React.useEffect(() => {
    if (!renderedInModal.current || !context) return;
    const { enableCanCloseOutside, disableCanCloseOutside } = renderedInModal.current;
    const id = uuid.generate();
    if (context.visible) {
      disableCanCloseOutside(id);
    } else {
      enableCanCloseOutside(id);
    }
    return () => enableCanCloseOutside(id);
  }, [context, renderedInModal]);

  React.useEffect(() => {
    if (!context || disabled || !triggerHTMLNode) return () => null;
    return handleTriggerElementEventsForClick(triggerHTMLNode, toggleOnClick, context);
  }, [context, disabled, toggleOnClick, triggerHTMLNode]);

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
      <VisibilityManager
        ref={setContext}
        outsideClickIgnoreElements={ignoreVisibilityManagerOutsideClickElements}
        closeOnClickOutside={closeOnClickOutside}
        onVisibilityChange={onVisibilityChange}
      >
        {triggerElement}
      </VisibilityManager>
      {context && <VisibilityManagerContext.Provider value={context}>{popupElement}</VisibilityManagerContext.Provider>}
    </PopupComponentInternalContextState.Provider>
  );
}

export default React.memo(PopupManagerForClick);
