import { style } from "@vanilla-extract/css";
import { body2mediumStyles, globalThemeColorVars } from "@app/ui-kit";
import { padding } from "polished";

export const menuLinksWrapperStyles = style({
  flex: 1,
  display: "flex",
  flexDirection: "column",
});

export const linkStyles = style([
  body2mediumStyles,
  { ...padding(8, 16), selectors: { "&:hover": { color: globalThemeColorVars.strokePrimary } } },
]);

export const linkActiveStyles = style({
  color: globalThemeColorVars.primary,
});
