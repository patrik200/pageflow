import React from "react";
import cn from "classnames";

import PopupComponent from "primitives/PopupManager/PopupComponent";

import { wrapperStyles } from "./style.css";

interface TooltipPopupInterface {
  className?: string;
  children: React.ReactNode;
}

function TooltipPopup({ className, children }: TooltipPopupInterface) {
  return (
    <PopupComponent>
      <div className={cn(wrapperStyles, className)}>
        {children}
        <div data-popper-arrow="true" />
      </div>
    </PopupComponent>
  );
}

export default React.memo(TooltipPopup);
