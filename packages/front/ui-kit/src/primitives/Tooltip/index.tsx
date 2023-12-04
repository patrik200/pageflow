import React from "react";
import { useProvideRef } from "@worksolutions/react-utils";
import cn from "classnames";

import PopupManager, { PopupManagerInterface } from "primitives/PopupManager";

import TooltipPopup from "./Popup";

export type TooltipInterface = PopupManagerInterface & { className?: string };

function Tooltip({ className, popupElement, triggerElement, ...props }: TooltipInterface, ref: React.Ref<HTMLElement>) {
  const newTriggerElement = React.cloneElement(triggerElement, {
    ref: useProvideRef(ref, (triggerElement as any).ref),
    className: cn(className, triggerElement.props.className),
  });

  return (
    <PopupManager
      maxHeight={false}
      triggerElement={newTriggerElement}
      popupElement={<TooltipPopup>{popupElement}</TooltipPopup>}
      {...props}
    />
  );
}

export default React.memo(React.forwardRef(Tooltip));
