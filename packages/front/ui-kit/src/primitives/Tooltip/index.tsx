import React from "react";
import { useProvideRef } from "@worksolutions/react-utils";
import cn from "classnames";

import PopupManager, { PopupManagerInterface } from "primitives/PopupManager";

import TooltipPopup from "./Popup";

export type TooltipInterface = PopupManagerInterface & { className?: string; tooltipPopupClassName?: string };

function Tooltip(
  { className, tooltipPopupClassName, popupElement, triggerElement, ...props }: TooltipInterface,
  ref: React.Ref<HTMLElement>,
) {
  const newTriggerElement = React.cloneElement(triggerElement, {
    ref: useProvideRef(ref, (triggerElement as any).ref),
    className: cn(className, triggerElement.props.className),
  });

  return (
    <PopupManager
      maxHeight={false}
      triggerElement={newTriggerElement}
      popupElement={<TooltipPopup className={tooltipPopupClassName}>{popupElement}</TooltipPopup>}
      {...props}
    />
  );
}

export default React.memo(React.forwardRef(Tooltip));
