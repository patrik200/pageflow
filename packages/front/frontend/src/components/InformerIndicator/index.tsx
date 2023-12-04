import React from "react";
import { Icon, PopupManagerMode, PopupManagerModifierOffset, Tooltip, Typography } from "@app/ui-kit";
import cn from "classnames";

import {
  indicatorForDetailStyles,
  indicatorForTableStyles,
  indicatorThemeStyleVariants,
  tooltipTextStyles,
} from "./style.css";

interface InformerIndicatorInterface {
  tooltip: React.ReactNode;
  theme?: "alarm" | "warn";
}

export const InformerIndicatorForTable = React.memo(function ({
  tooltip,
  theme = "alarm",
}: InformerIndicatorInterface) {
  return (
    <Tooltip
      strategy="fixed"
      popupElement={<Typography className={tooltipTextStyles}>{tooltip}</Typography>}
      triggerElement={
        <Icon className={cn(indicatorForTableStyles, indicatorThemeStyleVariants[theme])} icon="informationLine" />
      }
      mode={PopupManagerMode.HOVER}
      offset={tableOffset}
    />
  );
});

export const InformerIndicatorForDetail = React.memo(function ({
  tooltip,
  theme = "alarm",
}: InformerIndicatorInterface) {
  return (
    <Tooltip
      strategy="fixed"
      popupElement={<Typography className={tooltipTextStyles}>{tooltip}</Typography>}
      triggerElement={
        <Icon className={cn(indicatorForDetailStyles, indicatorThemeStyleVariants[theme])} icon="informationLine" />
      }
      primaryPlacement="bottom-start"
      mode={PopupManagerMode.HOVER}
      offset={detailOffset}
    />
  );
});

const tableOffset: PopupManagerModifierOffset = [-16, 10];

const detailOffset: PopupManagerModifierOffset = [-12, 10];
