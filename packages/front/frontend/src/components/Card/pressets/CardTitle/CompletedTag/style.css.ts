import { globalStyle, style } from "@vanilla-extract/css";

import { actionsTableCellWrapperStyles } from "components/ActionsTableCell/style.css";

export const tagStyles = style({});

globalStyle(`${actionsTableCellWrapperStyles} ${tagStyles}`, {
  marginTop: -6,
  marginRight: 8,
});

globalStyle(`:not(${actionsTableCellWrapperStyles}) ${tagStyles}`, {
  marginTop: 6,
  marginRight: 8,
});
