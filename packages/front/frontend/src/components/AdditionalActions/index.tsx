import React from "react";
import { observer } from "mobx-react-lite";
import { Button, PopupComponent, PopupManager, PopupManagerMode } from "@app/ui-kit";
import { stopPropagationHandler } from "@worksolutions/react-utils";

import { buttonStyles, popupStyles } from "./style.css";

interface AdditionalActionsInterface {
  closeOnClickOutside?: boolean;
  children: React.ReactNode;
}

function AdditionalActions({ closeOnClickOutside, children }: AdditionalActionsInterface) {
  return (
    <PopupManager
      primaryPlacement="bottom-end"
      strategy="fixed"
      popupWidth="auto"
      closeOnClickOutside={closeOnClickOutside}
      popupElement={
        <PopupComponent>
          <div className={popupStyles}>{children}</div>
        </PopupComponent>
      }
      triggerElement={
        <Button
          className={buttonStyles}
          iconLeft="more2Line"
          type="WITHOUT_BORDER"
          size="SMALL"
          onClick={stopPropagationHandler}
        />
      }
      mode={PopupManagerMode.CLICK}
    />
  );
}

export default observer(AdditionalActions);

export { default as AdditionalActionButton } from "./Button";
