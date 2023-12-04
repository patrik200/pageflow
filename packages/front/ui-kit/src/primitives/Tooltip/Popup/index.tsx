import React from "react";

import PopupComponent from "primitives/PopupManager/PopupComponent";

import { wrapperStyles } from "./style.css";

interface TooltipPopupInterface {
  children: React.ReactNode;
}

function TooltipPopup({ children }: TooltipPopupInterface) {
  return (
    <PopupComponent>
      <div className={wrapperStyles}>
        {children}
        <div data-popper-arrow="true" />
      </div>
    </PopupComponent>
  );
}

export default React.memo(TooltipPopup);
