import React from "react";

import { Icon, PopupManagerMode, Tooltip, Typography } from "main";

import { freeStyles, iconStyles, textStyles, wrapperStyle } from "./style.css";

export function TooltipDemo() {
  return (
    <div className={wrapperStyle}>
      <div className={freeStyles} />
      <Tooltip
        triggerElement={<Icon className={iconStyles} icon="informationLine" />}
        mode={PopupManagerMode.CLICK}
        primaryPlacement="top-start"
        offset={[-20, 12]}
        popupElement={
          <Typography className={textStyles}>
            some text some text some text some text some text some text some text some text some text some text
          </Typography>
        }
      />
      <div className={freeStyles} />
      <div className={freeStyles} />
    </div>
  );
}
