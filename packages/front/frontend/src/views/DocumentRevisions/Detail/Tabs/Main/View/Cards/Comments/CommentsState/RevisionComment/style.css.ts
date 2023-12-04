import { style } from "@vanilla-extract/css";
import { globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  gap: 16,
  border: "1px solid " + globalThemeColorVars.defaultShadow,
  boxShadow: "none",
});

export const discussionStyles = style({
  marginLeft: 24,
});
