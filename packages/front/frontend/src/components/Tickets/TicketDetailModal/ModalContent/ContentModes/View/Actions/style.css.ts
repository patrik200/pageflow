import { style } from "@vanilla-extract/css";
import { buttonBackgroundVar, globalThemeColorVars } from "@app/ui-kit";

export const containerStyles = style({
  display: "flex",
  alignItems: "center",
  gap: 8,
});

export const deleteButtonStyles = style({
  vars: { [buttonBackgroundVar]: globalThemeColorVars.red },
});
