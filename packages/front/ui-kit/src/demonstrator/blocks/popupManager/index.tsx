import React from "react";
import cn from "classnames";
import { useToggle } from "@worksolutions/react-utils";

import { Button, PopupComponent, PopupManager, PopupManagerMode, Typography } from "main";

import { popupComponentStyle, textStyles, wrapperStyle } from "./style.css";

export function PopupManagerDemo() {
  const [long, toggle] = useToggle(false);
  return (
    <div className={wrapperStyle}>
      <Button onClick={toggle}>Toggle long</Button>
      <PopupManager
        triggerElement={<Button style={{ width: long ? "200px" : "auto" }}>CLICK</Button>}
        mode={PopupManagerMode.CLICK}
        primaryPlacement="top"
        popupWidth="full"
        popupElement={
          <PopupComponent>
            <Typography className={cn(textStyles, popupComponentStyle)}>click</Typography>
          </PopupComponent>
        }
      />
      <PopupManager
        triggerElement={<Button>HOVER</Button>}
        mode={PopupManagerMode.HOVER}
        primaryPlacement="top"
        popupElement={
          <PopupComponent>
            <Typography className={cn(textStyles, popupComponentStyle)}>hover</Typography>
          </PopupComponent>
        }
      />
    </div>
  );
}
