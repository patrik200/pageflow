import { globalStyle, style } from "@vanilla-extract/css";
import { padding } from "polished";

import { actionsTableCellWrapperStyles } from "components/ActionsTableCell/style.css";

export const buttonStyles = style({
  ...padding(null, 8),
});

globalStyle(`${actionsTableCellWrapperStyles} ${buttonStyles}`, {
  marginTop: -7,
});
