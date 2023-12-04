import { globalStyle, style } from "@vanilla-extract/css";
import { boxShadow, globalThemeColorVars } from "@app/ui-kit";
import { padding } from "polished";

import { actionsTableCellWrapperStyles } from "components/ActionsTableCell/style.css";

export const popupStyles = style({
  minWidth: 130,
  display: "flex",
  flexDirection: "column",
  borderRadius: 8,
  ...padding(2, null),
  background: globalThemeColorVars.backgroundCard,
  border: "1px solid " + globalThemeColorVars.strokeLight,
  boxShadow: boxShadow({ y: 3, blur: 10, color: globalThemeColorVars.defaultShadow }),
});

export const buttonStyles = style({
  ...padding(null, 8),
});

globalStyle(`${actionsTableCellWrapperStyles} ${buttonStyles}`, {
  marginTop: -7,
});
