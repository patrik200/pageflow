import { style } from "@vanilla-extract/css";
import { padding } from "polished";
import { body2mediumStyles, globalThemeColorVars } from "@app/ui-kit";

export const wrapperStyles = style({
  display: "flex",
  alignItems: "center",
  gap: "8px 4px",
  flexWrap: "wrap",
  transition: "opacity 0.2s",
});

export const wrapperDisabledStyles = style({
  opacity: 0.3,
});

export const itemStyles = style([
  body2mediumStyles,
  {
    cursor: "pointer",
    color: globalThemeColorVars.textSecondary,
    ...padding(4, 8),
  },
]);

export const itemDisabledStyles = style({
  cursor: "default",
});

export const itemActiveStyles = style({
  color: globalThemeColorVars.textPrimary,
});

export const iconStyles = style({
  color: globalThemeColorVars.textSecondary,
  width: 12,
  height: 12,
});
