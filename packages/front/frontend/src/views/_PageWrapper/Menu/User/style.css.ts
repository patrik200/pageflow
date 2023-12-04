import { globalThemeColorVars } from "@app/ui-kit";
import { margin, padding } from "polished";
import { style } from "@vanilla-extract/css";

export const menuUserWrapperStyles = style({
  ...padding(8, null),
  marginLeft: 16,
  borderTop: "1px solid " + globalThemeColorVars.strokeLight,
  display: "flex",
  alignItems: "center",
  gap: 2,
  justifyContent: "space-between",
});

export const userLinkStyles = style({
  width: 0,
  padding: 8,
  ...margin(-4, -8),
  flex: 1,
});
